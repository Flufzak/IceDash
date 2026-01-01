import React, { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { store } from "./store";

import SplashScreen from "./screens/SplashScreen";
import GameScreen from "./screens/GameScreen";
import { AudioManager } from "./components/audio/AudioManager";

export default function App() {
  const [ready, setReady] = useState(false);

  const handleDone = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AudioManager />
        {ready ? <GameScreen /> : <SplashScreen onDone={handleDone} />}
      </GestureHandlerRootView>
    </Provider>
  );
}
