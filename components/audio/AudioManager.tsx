import { useEffect, useRef } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const TRACK_NORMAL = require("../../assets/audio/icedash.mp3");
const TRACK_BASS = require("../../assets/audio/icedash_2.mp3");

export function AudioManager() {
  const musicEnabled = useSelector((s: RootState) => s.audio.musicEnabled);
  const splashDone = useSelector((s: RootState) => s.ui.splashDone);
  const score = useSelector((s: RootState) => s.game.score);

  const normalRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const bassRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const useBass = score >= 500;

  useEffect(() => {
    if (!normalRef.current) {
      const p = createAudioPlayer(TRACK_NORMAL);
      p.loop = true;
      p.volume = 0.5;
      p.pause(); // start stil
      normalRef.current = p;
    }

    if (!bassRef.current) {
      const p = createAudioPlayer(TRACK_BASS);
      p.loop = true;
      p.volume = 0.5;
      p.pause(); // start stil
      bassRef.current = p;
    }

    // cleanup bij app exit
    return () => {
      try {
        normalRef.current?.pause();
        bassRef.current?.pause();
      } catch {}
    };
  }, []);

  // play/pause + switch logic
  useEffect(() => {
    const normal = normalRef.current;
    const bass = bassRef.current;
    if (!normal || !bass) return;

    // splash bezig of muziek uit: alles pauze
    if (!splashDone || !musicEnabled) {
      normal.pause();
      bass.pause();
      return;
    }

    // splash voorbij + muziek aan: kies track op basis van score
    if (useBass) {
      normal.pause();
      bass.play();
    } else {
      bass.pause();
      normal.play();
    }
  }, [musicEnabled, splashDone, useBass]);

  return null;
}
