import { Dimensions } from "react-native";

export const SCREEN = Dimensions.get("window");

export const GROUND_Y = SCREEN.height * 0.72;

export const PENGUIN_SIZE = 72;
export const PENGUIN_FOOT_OFFSET = 20;

export const OBSTACLE_FOOT_OFFSET = 13;

export const GRAVITY = 2400;
export const JUMP_VELOCITY = -900;

export const WALK_FPS = 12;

// gameplay
export const BASE_SPEED = 260;
export const SPEED_INCREMENT = 20; // hoeveel sneller per stap
export const SPEED_INTERVAL = 6; // seconden
export const MAX_SPEED = 520; // cap (belangrijk!)

// clouds
export const CLOUD_PARALLAX = 0.25;
