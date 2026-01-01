import { StyleSheet } from "react-native";
import { palette } from "./palette";

export const textStyles = StyleSheet.create({
  score: {
    fontFamily: "Jersey10",
    fontSize: 35,
    color: palette.ground,
    letterSpacing: 1.5,
    textShadowColor: palette.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scoreLabel: {
    fontFamily: "Jersey10",
    fontSize: 30,
    color: palette.ground,
    textShadowColor: palette.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  title: {
    fontFamily: "Jersey10",
    fontSize: 48,
    color: palette.ground,
    textShadowColor: palette.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  small: {
    fontFamily: "Jersey10",
    fontSize: 18,
    color: palette.ground,
    textShadowColor: palette.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});
