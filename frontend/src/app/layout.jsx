import { Inter, Playfair_Display, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/utils/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://byfalguni.com";

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Falguni Mondal | Creative Full-Stack MERN Developer",
    template: "%s | Falguni Mondal",
  },
  description:
    "Creative Full-Stack MERN Developer based in Durgapur, India. Helping brands gain an unfair advantage by developing digital adrenaline with React, Next.js, Node.js, GSAP, and Three.js.",
  applicationName: "By Falguni Portfolio",
  authors: [{ name: "Falguni Mondal", url: SITE_URL }],
  creator: "Falguni Mondal",
  publisher: "Falguni Mondal",
  category: "technology",
  keywords: [
    "Falguni Mondal",
    "Falguni",
    "Falguni dev",
    "Falguni MERN",
    "Falguni developer",
    "Falguni portfolio",
    "Falguni dev portfolio",
    "Falguni MERN portfolio",
    "Falguni React",
    "Falguni frontend",
    "Falguni backend",
    "Falguni full stack",
    "Falguni developer portfolio",
    "Web developer",
    "Web development",
    "Web app developer",
    "Web app development",
    "Website developer",
    "Website development",
    "MERN",
    "Full stack",
    "Developer",
    "Software Developer",
    "Software Engineer",
    "Creative website",
    "Creative developer",
    "Creative web developer",
    "Creative website developer",
    "Best web developer India",
    "Best MERN developer India",
    "Best MERN developer",
    "Indian developer",
    "Indian web developer",
    "Falguni Indian",
    "Falguni Mondal Indian",
    "Indian website builder",
    "Website builder",
    "Made in India website",
    "Made in India web app",
    "Made in India",
    "Indian creative dev",
    "Indian creative developer",
    "Indian software developer",
    "Indian software engineer",
    "Indian React developer",
    "React developer",
    "Indian Node developer",
    "Node developer",
    "India",
    "Indian 3D",
    "Indian 3D website",
    "Indian 3D web developer",
    "Falguni BCET",
    "Falguni Bengal College",
    "Falguni Bengal",
    "Falguni Durgapur",
    "Falguni LinkedIn",
    "Falguni GitHub",
    "Falguni West Bengal",
    "Falguni Bengal College of Engineering and Technology",
    "Bengal College of Engineering",
    "Engineering and Technology",
    "Falguni Node.js",
    "Falguni creative",
    "MERN stack developer Durgapur",
    "MERN stack developer",
    "MERN developer Durgapur",
    "Stack developer Durgapur",
    "Full Stack Developer India",
    "Developer India",
    "Full Stack India",
    "MongoDB Express React Node",
    "React.js expert",
    "React.js developer",
    "Next.js developer India",
    "Node.js backend developer",
    "Express.js API developer",
    "Tailwind CSS developer",
    "GSAP animation expert",
    "GSAP ScrollTrigger",
    "React Three Fiber developer",
    "Three.js 3D web developer",
    "WebGL developer",
    "Creative web developer India",
    "Software Engineer India",
    "IT professional Durgapur",
    "Bachelors in Information Technology",
    "IT graduate 2025",
    "Awwwards style web development",
    "High performance digital products",
    "E-commerce web developer",
    "Freelance MERN developer",
    "Agency space web developer",
    "3D web experiences",
    "Hire MERN stack developer",
    "Hire React developer India",
    "Hire WebGL developer",
    "Hire Three.js developer",
    "Hire creative developer",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Falguni Mondal — Creative MERN & Next.js Developer",
    title: "Falguni Mondal | Creative Full-Stack MERN Developer",
    description:
      "Full-stack creative MERN developer helping brands gain their unfair advantage by developing digital adrenaline.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Falguni Mondal — Creative Full-Stack MERN Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Falguni Mondal | Full Stack MERN Developer",
    description:
      "Full-stack creative MERN developer helping brands gain their unfair advantage by developing digital adrenaline.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "f-RkhXCjI2Kape27qO4PTgRF9Ctn24Lmsqd4xulRW7c",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Falguni Mondal",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/favicon.svg" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${playfair.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://ik.imagekit.io"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
