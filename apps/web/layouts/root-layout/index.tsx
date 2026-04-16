import { ReactNode } from "react"
import { Footer } from "../common/footer"
import { HomeNavbar } from "./navbar"

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <>
      <HomeNavbar />
      {children}
      <Footer />
    </>
  )
}

export default RootLayout
