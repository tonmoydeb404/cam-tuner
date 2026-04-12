"use client"

import {
  DeniedState,
  ErrorState,
  RequestingState,
  IdleState as SharedIdleState,
} from "@/components/camera-states"

export { DeniedState, ErrorState, RequestingState }

interface VideoStateProps {
  onStart: () => void
}

export const IdleState = ({ onStart }: VideoStateProps) => (
  <SharedIdleState
    onStart={onStart}
    title="Interactive Demo"
    description="Allow camera access to try the tuner with your own webcam feed."
    buttonLabel="Start Demo"
  />
)
