import PageHeader from "@/layouts/page-layout/header"
import TimelineSection from "./timeline"

interface WhatsNewViewProps {}

const WhatsNewView = (props: WhatsNewViewProps) => {
  return (
    <>
      <PageHeader
        title="What's New"
        description="Release history for CamTuner."
        className="mb-14"
      />

      <div className="container pb-32">
        <TimelineSection />
      </div>
    </>
  )
}

export default WhatsNewView
