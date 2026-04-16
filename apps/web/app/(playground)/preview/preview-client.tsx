"use client"

import PreviewView from "@/views/preview"
import { Suspense } from "react"
import WelcomeHandler from "./welcome-handler"

const PreviewPageClient = () => (
  <>
    <Suspense>
      <WelcomeHandler />
    </Suspense>
    <PreviewView />
  </>
)

export default PreviewPageClient
