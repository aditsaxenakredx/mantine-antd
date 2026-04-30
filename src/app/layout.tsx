import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider } from "@/components/MantineProvider";

export const metadata: Metadata = {
  title: "TaskFlow – Project Management SaaS",
  description: "Manage projects, tasks, and teams in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
