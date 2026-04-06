
import { Platform } from "react-native";
// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const COLORS = {
   bg: "#0D0F14",
  surface: "#161A22",
  card: "#00001f",
  border: "#252C3D",
  accent: "#C9A84C",
  accentMuted: "rgba(201,168,76,0.12)",
  accentSoft: "rgba(201,168,76,0.25)",
  text: "#E8EAF0",
  textSecondary: "#8892A4",
  textMuted: "#4E5668",
  success: "#2ECC71",
  successMuted: "rgba(46,204,113,0.12)",
  danger: "#E74C3C",
  dangerMuted: "rgba(231,76,60,0.10)",
  white: "#FFFFFF",
};

const FONTS = {
  display: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "700"
  },
  heading: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "600"
  },
  body: {
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif"
  },
  mono: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace"
  },
};

export { COLORS, FONTS };