type SoundType = "success" | "delete" | "clear";

const soundPaths: Record<SoundType, string> = {
  success: "/sounds/success.mp3",
  delete: "/sounds/delete.mp3",
  clear: "/sounds/clear.mp3",
};

export const playSound = (type: SoundType) => {
  const path = soundPaths[type];
  if (!path) return;

  try {
    const audio = new Audio(path);
    audio.volume = 1.0;
    audio.preload = "auto";

    audio.oncanplaythrough = () => {
      audio.play().catch(() => {});
    };
  } catch (e) {
    console.log("Audio error:", e);
  }
};
