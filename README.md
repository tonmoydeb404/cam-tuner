![CamTuner Logo](./apps/extension/public/icons/icon128.png)

# CamTuner

**CamTuner** is a browser extension that lets you customize your webcam feed with advanced features like zoom, crop, aspect ratios, letterbox mode, animated GIF overlays, confetti animations, and more - all output as a virtual webcam for video calls and streaming.

[![Get it on Chrome Web Store](https://img.shields.io/badge/Available_on-Chrome_Web_Store-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/camtuner/jokbnapnjdkccejojfidegbpnknfacmo?utm_source=item-share-cb)
[![Get it on Firefox Add-ons](https://img.shields.io/badge/Available_on-Firefox_Add--ons-orange?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/camtuner/)

> **Note**: CamTuner is an enhanced version of [vCam](https://github.com/tonmoydeb404/v-cam). It is built with React and TypeScript, unlike vCam, which was written in raw JavaScript.

## ✨ Features

### 📹 Camera & Frame Controls

- 🎥 **Multi-Camera Switching**  
  Instantly switch between connected cameras with real-time preview.

- 🎞️ **Custom Aspect Ratios**  
  Choose from flexible aspect ratio options like 16:9, 4:3, 1:1, and more.

- 📐 **Letterbox Mode (Fit to Frame)**  
  Scale video to fit while maintaining aspect ratio with customizable background colors.

- 🪞 **Mirror Your Feed**  
  Flip your video horizontally to match how you naturally view yourself.

- ↔️ **Horizontal Crop Alignment**  
  Align your cropped view horizontally - left, center, or right - for perfect framing.

### 🔍 Zoom & Effects

- 🔍 **Smooth Digital Zoom**  
  Zoom in seamlessly to highlight parts of your feed without any stutter.

- ⚡ **Instant Preview**  
  All adjustments are applied in real-time with zero lag or reloads.

### 🎉 Overlay Features

- 🎭 **Animated GIF Overlays**  
  Add fun animated GIFs to your video with precise positioning and sizing controls.

- 🎊 **Confetti Animations**  
  Celebrate with customizable confetti effects - perfect for special moments and achievements.

- 🎯 **Advanced Positioning**  
  Fine-tune overlay placement with intuitive position pickers and sizing options.

## 🛠️ Tech Stack

**CamTuner** is built with a modern stack to ensure a smooth, high-performance experience. Here's a breakdown of the key technologies used:

### Frontend

- **React JS**: A powerful JavaScript library for building dynamic user interfaces.
- **TypeScript**: Adds static typing to JavaScript for better maintainability and developer experience.
- **TailwindCSS**: A utility-first CSS framework to rapidly build custom designs.
- **ShadCn**: A UI component library built for building beautiful, accessible, and customizable interfaces.

### Build & Development Tools

- **Vite**: A next-generation, fast development build tool that provides lightning-fast hot module reloading and optimized production builds.
- **Vite Plugin Web Extension**: This plugin simplifies building browser extensions with Vite, making it easier to develop and bundle for multiple browsers.

## 🚀 Installation

CamTuner available on the [Chrome Web Store](https://chromewebstore.google.com/detail/jokbnapnjdkccejojfidegbpnknfacmo?utm_source=item-share-cb) & [Firefox Addon Store](https://addons.mozilla.org/en-US/firefox/addon/camtuner/) for one-click installation.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/tonmoydeb404/cam-tuner.git
cd cam-tuner

# Install dependencies
pnpm install
```

### 🧪 Development

```bash
# For Chrome extension development
pnpm dev

# For Firefox extension development
pnpm dev:firefox
```

This will start a development build and output the extension files to the appropriate directory.

### 🧱 Building for Production

To create a production-ready build for distribution:

```bash
# Build for Chrome
pnpm build

# Build for Firefox
pnpm build:firefox
```

### 🔌 Load Extension in Browser

**Chrome**

- Open chrome://extensions in your browser
- Enable Developer mode (top right)
- Click Load unpacked
- Select the **dist** folder

**Firefox**

- Open about:debugging in Firefox
- Click This Firefox
- Click Load Temporary Add-on
- Select `manifest.json` file from the **dist** folder

## 🤝 Contribute

We'd love to have your contributions to **CamTuner**! Whether you're fixing a bug, suggesting an enhancement, or adding a new feature, your input is highly appreciated.

### How to Contribute:

1. **Fork** this repository and clone it to your local machine.
2. Create a **new branch** for your feature or bug fix.
3. Make your changes, ensuring that the code follows the project's style guide.
4. **Test** your changes thoroughly.
5. **Commit** your changes with a meaningful message.
6. **Push** your branch to your fork.
7. Open a **pull request** with a description of the changes you've made.

### Guidelines

- **Respect the project's coding style** and conventions.
- **Write meaningful commit messages** explaining what and why you're changing.
- **Ensure code quality** with thorough testing (unit tests, integration tests).

## 📬 Developer Contact

If you have any questions, suggestions, or want to get in touch, feel free to reach out to me!

- **Email**: [tonmoydeb404@gmail.com](mailto:tonmoydeb404@gmail.com)
- **GitHub**: [tonmoyDeb404](https://github.com/tonmoydeb404)
- **Website**: [tonmoydeb.com](https://tonmoydeb.com)
