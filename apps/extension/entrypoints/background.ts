import { migrateFromV1 } from "../lib/migration"

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      console.debug("CamTuner extension installed")
      const webUrl = import.meta.env.VITE_WEB_URL
      if (!webUrl) throw new Error("VITE_WEB_URL is not set")
      await browser.tabs.create({ url: `${webUrl}/preview?welcome=true` })
    } else if (details.reason === "update") {
      console.debug("CamTuner extension updated")
      await migrateFromV1()
      const webUrl = import.meta.env.VITE_WEB_URL
      if (!webUrl) throw new Error("VITE_WEB_URL is not set")
      const { version } = browser.runtime.getManifest()
      await browser.tabs.create({
        url: `${webUrl}/whats-new?version=${version}`,
      })
    }
  })
})
