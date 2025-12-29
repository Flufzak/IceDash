import React, { useCallback, useState} from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './screens/SplashScreen';
import GameScreen from './screens/GameScreen';

export default function App() {
  const [ready, setReady] = useState(false);

  const handleDone = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {ready ? <GameScreen /> : <SplashScreen onDone={handleDone} />}
    </GestureHandlerRootView>
  );
}

