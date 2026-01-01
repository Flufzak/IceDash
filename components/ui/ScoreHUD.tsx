import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { textStyles } from "../../styles/text";

export default function ScoreHUD() {
  const score = useSelector((s: RootState) => s.game.score);

  return (
    <View style={styles.container}>
      <Text style={textStyles.scoreLabel}>score: </Text>
      <Text style={textStyles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 70,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
