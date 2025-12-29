import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import { Snowfall } from 'react-native-snowfall';

type Props = {
  onRetry: () => void;
  onMenu: () => void;
};

export function GameOverDialog({ onRetry, onMenu }: Props) {
  return (
    <View style={styles.overlay}>
      <Image
        source={require('../assets/ui/gameover-dialog.png')}
        style={styles.dialog}
        resizeMode="stretch"
      />

      <View style={styles.buttons}>
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>RETRY</Text>
        </Pressable>

        <Pressable onPress={onMenu} style={styles.button}>
          <Text style={styles.buttonText}>MENU</Text>
        </Pressable>
      </View>
    </View>
  );
}
const DIALOG_WIDTH = 320;
const DIALOG_HEIGHT = 180;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialog: {
    width: DIALOG_WIDTH,
    height: DIALOG_HEIGHT,
  },

  buttons: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 16,
  },

  button: {
    backgroundColor: '#45e6f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#FF80BF',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'PressStart2P',
  },
});
