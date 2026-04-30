"use client";

import { MantineProvider as BaseMantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { ReactNode } from "react";

const theme = createTheme({
  primaryColor: "indigo",
  primaryShade: 5,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  defaultRadius: "md",
  colors: {
    indigo: [
      "#eef2ff",
      "#e0e7ff",
      "#c7d2fe",
      "#a5b4fc",
      "#818cf8",
      "#6366f1",
      "#4f46e5",
      "#4338ca",
      "#3730a3",
      "#312e81",
    ],
  },
});

export function MantineProvider({ children }: { children: ReactNode }) {
  return (
    <BaseMantineProvider theme={theme}>
      <Notifications position="top-right" />
      {children}
    </BaseMantineProvider>
  );
}
