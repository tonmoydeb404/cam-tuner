import { ReactNode } from "react"
import { Footer } from "../common/footer"
import { PageNavbar } from "./navbar"

type Props = {
  children: ReactNode
}

const PageLayout = ({ children }: Props) => {
  return (
    <>
      <PageNavbar />
      {children}
      <Footer />
    </>
  )
}

export default PageLayout
