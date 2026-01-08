import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif",
});

export const metadata = {
  title: "新潟県の日本酒ソムリエ - 新潟清酒",
  description: "あなたの気分に合わせた新潟の地酒を提案します。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${notoSerifJP.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
