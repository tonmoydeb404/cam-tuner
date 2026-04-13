![CamTuner Logo](./apps/extension/public/icon128.png)

# CamTuner

**Your webcam, your rules.** CamTuner is a browser extension that lets you fine-tune your webcam feed — crop, zoom, align, switch aspect ratios, and apply letterbox framing — all in real-time as a virtual webcam for video calls and streaming.

[![Get it on Chrome Web Store](https://img.shields.io/badge/Available_on-Chrome_Web_Store-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/camtuner/jokbnapnjdkccejojfidegbpnknfacmo?utm_source=item-share-cb)
[![Get it on Firefox Add-ons](https://img.shields.io/badge/Available_on-Firefox_Add--ons-orange?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/camtuner/)

> **Note**: CamTuner is an enhanced version of [vCam](https://github.com/tonmoydeb404/v-cam). It is built with React and TypeScript, unlike vCam, which was written in raw JavaScript.

## ✨ Features

### 📹 Camera & Frame Controls

- 🎞️ **Custom Aspect Ratios**  
  Choose from flexible aspect ratio options — 16:9, 4:3, 1:1, and 9:16 (portrait).

- 📐 **Letterbox Mode (Fit to Frame)**  
  Scale video to fit while maintaining aspect ratio with customizable background colors.

- 🎯 **9-Point Crop Alignment**  
  Position your cropped view using a full 3×3 alignment grid — top, center, bottom combined with left, center, right.

- 🎥 **Multi-Camera Switching**  
  Instantly switch between connected cameras with real-time preview.

### 🔍 Zoom & Effects

- 🔍 **Smooth Digital Zoom**  
  Zoom in up to 3× seamlessly to highlight parts of your feed without any stutter.

- ⚡ **Instant Preview**  
  All adjustments are applied in real-time with zero lag or reloads.

## 🏗️ Project Structure

CamTuner is a **monorepo** powered by [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/repo):

| Package                      | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `apps/extension`             | Browser extension (Chrome & Firefox)                         |
| `apps/web`                   | Next.js marketing & live-preview site                        |
| `packages/stream-config`     | Shared video-processing library (Canvas & WebCodecs engines) |
| `packages/ui`                | Shared React component library (Radix UI + shadcn)           |
| `packages/eslint-config`     | Shared ESLint configurations                                 |
| `packages/typescript-config` | Shared TypeScript configurations                             |

## 🛠️ Tech Stack

**CamTuner** is built with a modern stack to ensure a smooth, high-performance experience. Here's a breakdown of the key technologies used:

### Frontend

- **React 19**: A powerful JavaScript library for building dynamic user interfaces.
- **TypeScript 5**: Adds static typing to JavaScript for better maintainability and developer experience.
- **TailwindCSS 4**: A utility-first CSS framework to rapidly build custom designs.
- **Radix UI + shadcn**: Accessible, customizable UI component primitives and pre-built components.
- **Next.js 16**: Powers the marketing site and live camera-preview page (with Turbopack).

### Build & Development Tools

- **WXT**: A modern framework for building cross-browser extensions with Vite under the hood.
- **Turborepo**: Orchestrates builds, linting, and type-checking across the monorepo.
- **TSup**: Bundles the `stream-config` library as CJS + ESM with type declarations.

## 🚀 Installation

CamTuner available on the [Chrome Web Store](https://chromewebstore.google.com/detail/jokbnapnjdkccejojfidegbpnknfacmo?utm_source=item-share-cb) & [Firefox Addon Store](https://addons.mozilla.org/en-US/firefox/addon/camtuner/) for one-click installation.

## 🚀 Quick Start

### Prerequisites

- Node.js (v20 or higher)
- pnpm package manager (v9+)

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
