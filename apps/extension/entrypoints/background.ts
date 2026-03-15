export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      console.log("CamTuner extension installed")
    } else if (details.reason === "update") {
      console.log("CamTuner extension updated")
    }
  })
})
