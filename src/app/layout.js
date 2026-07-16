import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Prof. Sunaja Devi K R | Department of Chemistry, Christ University",
  description:
    "Official academic website of Prof. Sunaja Devi K R, Professor of Chemistry at Christ (Deemed to be University), Bangalore. Specializing in materials chemistry, energy storage, MOFs, and environmental remediation.",
  keywords:
    "Sunaja Devi, Chemistry, Christ University, MOFs, Nanomaterials, Energy Storage, Catalysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
