import { useEffect, useRef } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
console.log("AudioManager mounted");

export function AudioManager() {
  const musicEnabled = useSelector((s: RootState) => s.audio.musicEnabled);
  const splashDone = useSelector((s: RootState) => s.ui.splashDone);

  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
    console.log("musicEnabled", musicEnabled, "splashDone", splashDone);
  }, []);

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = createAudioPlayer(
        require("../../assets/audio/icedash.mp3")
      );
      playerRef.current.loop = true;
      playerRef.current.volume = 0.5;
    }

    const p = playerRef.current;

    if (!splashDone) {
      p.pause();
      return;
    }

    if (musicEnabled) p.play();
    else p.pause();
  }, [musicEnabled, splashDone]);

  return null;
}
