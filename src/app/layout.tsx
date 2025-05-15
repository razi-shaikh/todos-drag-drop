// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "To-Do List with Drag & Drop",
  description:
    "A simple to-do list app with drag and drop functionality using Dragula.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}
