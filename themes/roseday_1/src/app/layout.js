import { Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata = {
  title: "Something Special!",
  description: "A romantic message just for you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${kalam.className} antialiased select-none`}
      >
        {children}
      </body>
    </html>
  );
}
