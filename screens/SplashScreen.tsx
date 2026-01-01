import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SnowOverlay } from "../components/ui/SnowOverlay";
import { useDispatch } from "react-redux";
import { setSplashDone } from "../store/uiSlice";
import { palette } from "../styles/palette";

type Props = {
  onDone: () => void;
};

export default function SplashScreen({ onDone }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setSplashDone(true));
      onDone();
    }, 2500);

    return () => clearTimeout(t);
  }, [dispatch, onDone]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo/opening.gif")}
        style={styles.logo}
      />
      <SnowOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.primary,
  },
  logo: { width: 490, height: 490, resizeMode: "contain" },
});
