cask "cam-tuner" do
  arch arm: "aarch64"

  version "3.1.2"
  sha256 "no-hash-yet"

  url "https://github.com/tonmoydeb404/cam-tuner/releases/download/v#{version}/CamTuner_#{version}_#{arch}.dmg"
  name "CamTuner"
  desc "Fine-tune your webcam — crop, zoom, align, and blur, as a cross-platform desktop app."
  homepage "https://github.com/tonmoydeb404/cam-tuner"

  depends_on macos: :big_sur
  depends_on arch: :arm64

  app "CamTuner.app"

  # Unsigned/un-notarized build: strip the quarantine flag Gatekeeper adds on download.
  postflight do
    system_command "/usr/bin/xattr",
                    args: ["-cr", "#{appdir}/CamTuner.app"]
  end

  zap trash: [
    "~/Library/Application Support/app.camtuner",
    "~/Library/Caches/app.camtuner",
    "~/Library/Preferences/app.camtuner.plist",
    "~/Library/Saved Application State/app.camtuner.savedState",
  ]
end
