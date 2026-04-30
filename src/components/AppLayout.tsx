"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AppShell,
  Avatar,
  Group,
  Text,
  ActionIcon,
  Indicator,
  Menu,
  Box,
  UnstyledButton,
  Tooltip,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconFolderOpen,
  IconChecklist,
  IconUsers,
  IconSettings,
  IconBell,
  IconSearch,
  IconLogout,
  IconUser,
  IconBolt,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconTable,
  IconBook,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", icon: IconLayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: IconFolderOpen, label: "Projects" },
  { href: "/tasks", icon: IconChecklist, label: "Tasks" },
  { href: "/team", icon: IconUsers, label: "Team" },
  { href: "/editable-table", icon: IconTable, label: "Data Table" },
  { href: "/settings", icon: IconSettings, label: "Settings" },
  { href: "/principles", icon: IconBook, label: "Design Principles" },
];

const BRAND = "#6366f1";
const SIDEBAR_BG = "#0f172a";
const NAV_ACTIVE_BG = "#4f46e5";
const NAV_TEXT = "rgba(255,255,255,0.6)";
const NAV_BORDER = "rgba(255,255,255,0.08)";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const sidebarWidth = collapsed ? 80 : 240;

  return (
    <AppShell
      navbar={{ width: sidebarWidth, breakpoint: "sm", collapsed: { mobile: true } }}
      header={{ height: 64 }}
      padding={0}
      styles={{
        navbar: {
          background: SIDEBAR_BG,
          border: "none",
          transition: "width 0.2s",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        header: { borderBottom: "1px solid #f0f0f0", background: "#fff" },
        main: { background: "#f8fafc" },
      }}
    >
      {/* ── Header ── */}
      <AppShell.Header>
        <Group h="100%" px={{ base: "md", sm: "xl" }} justify="space-between">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed
              ? <IconLayoutSidebarRightCollapse size={20} />
              : <IconLayoutSidebarLeftCollapse size={20} />}
          </ActionIcon>

          <Group gap={4}>
            <Tooltip label="Search">
              <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                <IconSearch size={18} />
              </ActionIcon>
            </Tooltip>
            <Indicator label={4} size={16} color="red">
              <Tooltip label="Notifications">
                <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                  <IconBell size={18} />
                </ActionIcon>
              </Tooltip>
            </Indicator>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Avatar
                  style={{ background: BRAND, cursor: "pointer" }}
                  size={36}
                  radius="xl"
                >
                  AS
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={14} />}>My Profile</Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>Account Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={14} />} color="red">
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ── Navbar ── */}
      <AppShell.Navbar style={{ display: "flex", flexDirection: "column" }}>
        {/* Logo */}
        <Box
          style={{
            padding: collapsed ? "1.25rem 0.75rem" : "1.25rem 1.5rem",
            borderBottom: `1px solid ${NAV_BORDER}`,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            flexShrink: 0,
          }}
        >
          <Box
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconBolt size={16} color="#fff" />
          </Box>
          {!collapsed && (
            <Text fw={700} size="md" style={{ color: "#fff", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
              TaskFlow
            </Text>
          )}
        </Box>

        {/* Nav items */}
        <Box style={{ flex: 1, padding: "0.5rem 0", overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Tooltip
                key={item.href}
                label={item.label}
                position="right"
                disabled={!collapsed}
              >
                <UnstyledButton
                  onClick={() => router.push(item.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    width: "100%",
                    padding: "0.625rem 1.5rem",
                    borderRadius: 0,
                    background: active ? NAV_ACTIVE_BG : "transparent",
                    color: active ? "#fff" : NAV_TEXT,
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = NAV_TEXT;
                    }
                  }}
                >
                  <item.icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && <Text size="sm" style={{ color: "inherit" }}>{item.label}</Text>}
                </UnstyledButton>
              </Tooltip>
            );
          })}
        </Box>

        {/* User section */}
        <Box
          style={{
            borderTop: `1px solid ${NAV_BORDER}`,
            padding: collapsed ? "1rem 0.75rem" : "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            flexShrink: 0,
          }}
        >
          <Avatar
            style={{ background: BRAND, flexShrink: 0 }}
            size={32}
            radius="xl"
          >
            AS
          </Avatar>
          {!collapsed && (
            <Box style={{ overflow: "hidden" }}>
              <Text
                size="sm"
                fw={600}
                style={{ color: "#fff", lineHeight: "1.125rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                Adit Saxena
              </Text>
              <Text size="xs" style={{ color: "rgba(255,255,255,0.4)" }}>Admin</Text>
            </Box>
          )}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
