import RootLayout from "@/layouts/root-layout"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const AppRootLayout = (props: Props) => {
  return <RootLayout>{props.children}</RootLayout>
}

export default AppRootLayout
