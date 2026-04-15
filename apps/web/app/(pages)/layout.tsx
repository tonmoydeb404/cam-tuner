import PageLayout from "@/layouts/page-layout"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const AppPageLayout = (props: Props) => {
  return <PageLayout>{props.children}</PageLayout>
}

export default AppPageLayout
