import React, { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { useFonts, Jersey10_400Regular } from "@expo-google-fonts/jersey-10";

import { store } from "./store";

import SplashScreen from "./screens/SplashScreen";
import GameScreen from "./screens/GameScreen";
import { AudioManager } from "./components/audio/AudioManager";

export default function App() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Jersey10: Jersey10_400Regular, // 👈 deze naam moet matchen met fontFamily
  });

  const handleDone = useCallback(() => {
    setReady(true);
  }, []);
  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AudioManager />
        {ready ? <GameScreen /> : <SplashScreen onDone={handleDone} />}
      </GestureHandlerRootView>
    </Provider>
  );
}
