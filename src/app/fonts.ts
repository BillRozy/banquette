import { Inter, Inter_Tight, Montserrat } from "next/font/google";

export const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin", "cyrillic"],
});

export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});
