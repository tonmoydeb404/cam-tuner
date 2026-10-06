import { AppSidebar } from "@/components/app-sidebar"
import { ListSkeleton } from "@/components/list-skeleton"
import { AppLayout } from "@/layouts/app-layout"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Toaster } from "@workspace/ui/components/sonner"
import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import { ModalProvider } from "./context/modal-context"
import { AppProvider, useApp } from "./context/app-context"
import { StudioScreen } from "./screens/studio"
import { VcamScreen } from "./screens/vcam"

function LoadingShell() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <div
          data-tauri-drag-region
          className="h-9 shrink-0 border-b border-border"
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <section className="scrollbar-thin min-h-0 flex-1 overflow-auto p-4">
            <ListSkeleton />
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ErrorShell({ error }: { error: string }) {
  return (
    <main className="flex h-svh w-screen flex-col items-center justify-center gap-2 overflow-hidden px-6 text-center">
      <strong className="text-danger text-[0.88rem]">
        Something went wrong
      </strong>
      <span className="text-[0.76rem] text-muted-foreground">{error}</span>
    </main>
  )
}

function AppRoutes() {
  const { loading, error } = useApp()

  if (loading) return <LoadingShell />
  if (error) return <ErrorShell error={error} />

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<StudioScreen />} />
        <Route path="vcam" element={<VcamScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ModalProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
        <Toaster position="top-right" />
      </ModalProvider>
    </AppProvider>
  )
}
