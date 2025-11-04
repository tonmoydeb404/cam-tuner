import confetti from "canvas-confetti";

export const triggerConfetti = async (
  type: string,
  colors: string[],
  intensity: number,
  duration: number
): Promise<void> => {
  const count = Math.floor((intensity / 100) * 200); // Scale particles based on intensity
  const defaults = {
    origin: { y: 0.7 },
    colors: colors,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Different confetti patterns based on type
  if (type === "hearts") {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      scalar: 1.2,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } else if (type === "stars") {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      shapes: ["star"],
    });
    fire(0.2, {
      spread: 60,
      shapes: ["star"],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      shapes: ["star"],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      shapes: ["star"],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      shapes: ["star"],
    });
  } else {
    // Classic and celebration patterns
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
};
