import { Logger } from "../utils/log";

// ============================================================================
// Constants
// ============================================================================

const IFRAME_URL = import.meta.env.VITE_IFRAME_URL || "http://localhost:9000";
const ELEMENT_ID = "cam-tuner-iframe-container";
const STYLE_ID = "cam-tuner-iframe-styles";
const CLOSE_BUTTON_ID = "cam-tuner-close-button";
const IFRAME_ID = "cam-tuner-iframe";

// ============================================================================
// Styles
// ============================================================================

const STYLES = `
  @keyframes cam-tuner-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes cam-tuner-fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes cam-tuner-scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes cam-tuner-scale-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  #${ELEMENT_ID} {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.5);
    animation: cam-tuner-fade-in 0.2s ease-out;
  }

  #${ELEMENT_ID}.closing {
    animation: cam-tuner-fade-out 0.2s ease-in forwards;
  }

  #${IFRAME_ID} {
    width: 90vw;
    height: 90vh;
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    background-color: white;
    animation: cam-tuner-scale-in 0.3s ease-out;
  }

  #${ELEMENT_ID}.closing #${IFRAME_ID} {
    animation: cam-tuner-scale-out 0.2s ease-in forwards;
  }

  #${CLOSE_BUTTON_ID} {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 2147483648;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition: background-color 0.2s, transform 0.1s;
  }

  #${CLOSE_BUTTON_ID}:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  #${CLOSE_BUTTON_ID}:active {
    transform: scale(0.95);
  }
`;

// ============================================================================
// Style Injection
// ============================================================================

const injectStyles = (): void => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.id = STYLE_ID;
  styleElement.textContent = STYLES;
  document.head.appendChild(styleElement);

  Logger.dev("Styles injected");
};

// ============================================================================
// Element Creation
// ============================================================================

const createContainer = (): HTMLDivElement => {
  const container = document.createElement("div");
  container.id = ELEMENT_ID;
  container.dataset.visible = "true";
  return container;
};

const createCloseButton = (onClose: () => void): HTMLButtonElement => {
  const button = document.createElement("button");
  button.id = CLOSE_BUTTON_ID;
  button.textContent = "✕";
  button.setAttribute("aria-label", "Close iframe overlay");

  button.addEventListener("click", () => {
    Logger.dev("Close button clicked");
    onClose();
  });

  return button;
};

const createIframe = (): HTMLIFrameElement => {
  const iframe = document.createElement("iframe");
  iframe.id = IFRAME_ID;
  iframe.allow = "camera; microphone; fullscreen; display-capture";
  iframe.src = IFRAME_URL;
  iframe.setAttribute("title", "Camera Tuner");
  return iframe;
};

// ============================================================================
// Animation Handlers
// ============================================================================

const closeWithAnimation = (container: HTMLElement): void => {
  container.classList.add("closing");

  // Wait for animation to complete before removing
  setTimeout(() => {
    container.remove();
    Logger.dev("Iframe overlay removed");
  }, 200); // Match animation duration
};

// ============================================================================
// Main Export
// ============================================================================

export const createIframeOverlay = (): void => {
  const existingContainer = document.getElementById(ELEMENT_ID);

  if (existingContainer) {
    Logger.dev("Iframe already exists, closing it");
    closeWithAnimation(existingContainer);
    return;
  }

  Logger.dev("Creating iframe overlay with URL:", IFRAME_URL);

  // Inject styles
  injectStyles();

  // Create elements
  const container = createContainer();
  const iframe = createIframe();
  const closeButton = createCloseButton(() => closeWithAnimation(container));

  // Assemble DOM
  container.appendChild(closeButton);
  container.appendChild(iframe);
  document.body.appendChild(container);

  Logger.dev("Iframe overlay created and visible");
};
