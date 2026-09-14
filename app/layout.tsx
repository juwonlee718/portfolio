import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이주원 — Portfolio",
  description: "궁금한 건 들여다보고, 재밌어 보이는 건 직접 해보는 이주원의 포트폴리오",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
