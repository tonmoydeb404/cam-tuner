import { ReactNode } from "react"
import { Footer } from "../common/footer"
import { Navbar } from "../common/navbar"

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default RootLayout
