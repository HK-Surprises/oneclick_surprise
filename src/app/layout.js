import { Comfortaa, Shantell_Sans } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});
const shantell = Shantell_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "OneClick Surprises",
  description: "Celebrate your day with our digital Surprises!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${shantell.className} antialiased bg-background select-none`}
      >
        {children}
      </body>
    </html>
  );
}
