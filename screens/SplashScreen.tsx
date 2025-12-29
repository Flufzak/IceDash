import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SnowOverlay } from '../components/ui/SnowOverlay';

type Props = {
  onDone: () => void;
};

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500); // 2s
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo/opening.gif')}
        style={styles.logo}
      />
      <SnowOverlay/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4bdceb' },
  logo: { width: 490, height: 490, resizeMode: 'stretch' },
});
