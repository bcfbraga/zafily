export interface DesignSettings {
  theme: string;
  header: string;
  wallpaper: string;
  buttons: string;
  text: string;
  colors: string;
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  theme: "Marsala",
  header: "Classic",
  wallpaper: "Gradient",
  buttons: "Glass",
  text: "Playfair, Inter",
  colors: "Marsala",
};

interface ColorPalette {
  brand: string;
  light: { bg: string; text: string; muted: string };
  dark: { bg: string; text: string; muted: string };
  gradient: string;
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  "Marsala": {
    brand: "#8C2F45",
    light: { bg: "#F7E9EC", text: "#2B1B33", muted: "rgba(43,27,51,0.62)" },
    dark: { bg: "#2B1B33", text: "#FFFFFF", muted: "rgba(255,255,255,0.72)" },
    gradient: "linear-gradient(160deg, #8C2F45 0%, #2B1B33 100%)",
  },
  "Violeta": {
    brand: "#6C63FF",
    light: { bg: "#F1F0FB", text: "#16162B", muted: "rgba(22,22,43,0.6)" },
    dark: { bg: "#16162B", text: "#FFFFFF", muted: "rgba(255,255,255,0.72)" },
    gradient: "linear-gradient(160deg, #6C63FF 0%, #2B1B33 100%)",
  },
  "Preto & Branco": {
    brand: "#16162B",
    light: { bg: "#FAFAFA", text: "#16162B", muted: "rgba(22,22,43,0.6)" },
    dark: { bg: "#16162B", text: "#FFFFFF", muted: "rgba(255,255,255,0.72)" },
    gradient: "linear-gradient(160deg, #4B4768 0%, #16162B 100%)",
  },
  "Dourado": {
    brand: "#B9852F",
    light: { bg: "#FBF3E3", text: "#3B2A12", muted: "rgba(59,42,18,0.62)" },
    dark: { bg: "#3B2A12", text: "#FFFFFF", muted: "rgba(255,255,255,0.72)" },
    gradient: "linear-gradient(160deg, #F3D9A4 0%, #B9852F 100%)",
  },
};

const FONT_STACKS: Record<string, { heading: string; body: string }> = {
  "Poppins, Link Sans": { heading: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif" },
  "Inter, System": { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  "Playfair, Inter": { heading: "'Playfair Display', serif", body: "'Inter', sans-serif" },
};

export interface ResolvedDesign {
  background: string;
  backgroundImage: string | null;
  textColor: string;
  mutedColor: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string | null;
  fontHeading: string;
  fontBody: string;
  headerVariant: string;
  brand: string;
}

export function resolveDesign(settings: DesignSettings | null | undefined, photoUrl: string | null): ResolvedDesign {
  const s = settings ?? DEFAULT_DESIGN_SETTINGS;
  const palette = COLOR_PALETTES[s.colors] ?? COLOR_PALETTES["Marsala"];
  const fonts = FONT_STACKS[s.text] ?? FONT_STACKS["Playfair, Inter"];

  let background: string;
  let backgroundImage: string | null = null;
  let textColor: string;
  let mutedColor: string;

  if (s.wallpaper === "Gradient") {
    background = palette.gradient;
    textColor = palette.dark.text;
    mutedColor = palette.dark.muted;
  } else if (s.wallpaper === "Foto" && photoUrl) {
    background = palette.dark.bg;
    backgroundImage = photoUrl;
    textColor = "#FFFFFF";
    mutedColor = "rgba(255,255,255,0.72)";
  } else {
    background = palette.light.bg;
    textColor = palette.light.text;
    mutedColor = palette.light.muted;
  }

  let buttonBg: string;
  let buttonText: string;
  let buttonBorder: string | null = null;

  if (s.buttons === "Solid") {
    buttonBg = palette.brand;
    buttonText = "#FFFFFF";
  } else if (s.buttons === "Outline") {
    buttonBg = "transparent";
    buttonText = textColor;
    buttonBorder = textColor === "#FFFFFF" ? "rgba(255,255,255,0.6)" : textColor;
  } else {
    buttonBg = textColor === "#FFFFFF" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.06)";
    buttonText = textColor;
    buttonBorder = textColor === "#FFFFFF" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)";
  }

  return {
    background,
    backgroundImage,
    textColor,
    mutedColor,
    buttonBg,
    buttonText,
    buttonBorder,
    fontHeading: fonts.heading,
    fontBody: fonts.body,
    headerVariant: s.header || "Classic",
    brand: palette.brand,
  };
}
