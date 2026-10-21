import HomeView from "@/views/home"
import { HomeFaqSchema } from "@/components/schema-markup"
import { brand } from "@/data/brand"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/",
  title: brand.title,
  description: brand.description.full,
})

export default function Page() {
  return (
    <>
      <HomeFaqSchema />
      <HomeView />
    </>
  )
}
