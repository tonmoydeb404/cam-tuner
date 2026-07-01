"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * A background image stored in extension storage (or in-memory fallback).
 */
export type BackgroundImageEntry = {
  id: string
  name: string
  dataUrl: string
}

const REQUEST_EVENT = "camtuner:request-background-images"
const IMAGES_MSG = "camtuner:background-images"
const ADD_MSG = "camtuner:add-background-image"
const REMOVE_MSG = "camtuner:remove-background-image"
const SYNC_TIMEOUT_MS = 1500

/**
 * Syncs user-uploaded background images with extension storage
 * (`storage.local:backgroundImages`) via the content-script postMessage bridge.
 *
 * When the extension is not installed (no response within the timeout), falls
 * back to an in-memory `Map` so the preview still works — uploads just don't
 * persist across page refreshes.
 */
export function useBackgroundImages() {
  const [images, setImages] = useState<BackgroundImageEntry[]>([])
  const imagesRef = useRef<Map<string, BackgroundImageEntry>>(new Map())
  const extensionConnected = useRef(false)

  const syncFromMap = useCallback(() => {
    setImages(Array.from(imagesRef.current.values()))
  }, [])

  // Request the initial list from the extension and listen for live updates.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== IMAGES_MSG) return

      const incoming = event.data.images as BackgroundImageEntry[] | undefined
      if (!Array.isArray(incoming)) return

      extensionConnected.current = true
      imagesRef.current = new Map(incoming.map((img) => [img.id, img]))
      syncFromMap()
    }

    window.addEventListener("message", handleMessage)
    window.dispatchEvent(new CustomEvent(REQUEST_EVENT))

    // If the extension doesn't respond, we silently fall back to in-memory.
    timeout = setTimeout(() => {
      if (!extensionConnected.current) syncFromMap()
    }, SYNC_TIMEOUT_MS)

    return () => {
      window.removeEventListener("message", handleMessage)
      if (timeout) clearTimeout(timeout)
    }
  }, [syncFromMap])

  const addImage = useCallback(
    async (name: string, dataUrl: string): Promise<string> => {
      const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const entry: BackgroundImageEntry = { id, name, dataUrl }
      imagesRef.current.set(id, entry)

      if (extensionConnected.current) {
        window.postMessage(
          { type: ADD_MSG, name, dataUrl, tempId: id },
          window.location.origin
        )
      }
      syncFromMap()
      return id
    },
    [syncFromMap]
  )

  const removeImage = useCallback(
    async (id: string): Promise<void> => {
      imagesRef.current.delete(id)

      if (extensionConnected.current) {
        window.postMessage(
          { type: REMOVE_MSG, id },
          window.location.origin
        )
      }
      syncFromMap()
    },
    [syncFromMap]
  )

  return {
    images,
    imagesRef,
    addImage,
    removeImage,
    extensionConnected: extensionConnected.current,
  }
}
