"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  Badge,
  Avatar,
  Progress,
  Button,
  Stack,
  Timeline,
  ThemeIcon,
  SimpleGrid,
  Box,
} from "@mantine/core";
import {
  IconFolderOpen,
  IconCircleCheck,
  IconClock,
  IconUsers,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPlus,
  IconCalendar,
  IconBolt,
} from "@tabler/icons-react";
import { DataTable } from "./DataTable";

const BRAND = "#6366f1";

const stats = [
  { title: "Total Projects",  value: 24,   change: 12, up: true,  icon: IconFolderOpen,  color: BRAND,     bg: "#eef2ff" },
  { title: "Tasks Completed", value: 348,  change: 8,  up: true,  icon: IconCircleCheck, color: "#10b981", bg: "#ecfdf5" },
  { title: "Hours Logged",    value: 1284, change: 3,  up: false, icon: IconClock,       color: "#f59e0b", bg: "#fffbeb" },
  { title: "Team Members",    value: 18,   change: 2,  up: true,  icon: IconUsers,       color: "#3b82f6", bg: "#eff6ff" },
];

interface ProjectRow {
  name: string;
  status: string;
  priority: string;
  progress: number;
  due: string;
  team: string[];
}

const projects: ProjectRow[] = [
  { name: "Website Redesign",    status: "On Track",  priority: "High",   progress: 72,  due: "May 15", team: ["Alice", "Bob", "Carol"] },
  { name: "Mobile App v2",       status: "At Risk",   priority: "High",   progress: 45,  due: "May 28", team: ["Dave", "Eve"] },
  { name: "API Integration",     status: "On Track",  priority: "Medium", progress: 88,  due: "Apr 30", team: ["Frank", "Grace", "Henry"] },
  { name: "Data Pipeline",       status: "Delayed",   priority: "Medium", progress: 31,  due: "Jun 10", team: ["Iris"] },
  { name: "Dashboard Analytics", status: "Completed", priority: "Low",    progress: 100, due: "Apr 20", team: ["Jack", "Kim"] },
];

const statusColor: Record<string, string> = {
  "On Track": "teal", "At Risk": "yellow", "Delayed": "red", "Completed": "gray",
};

const upcomingTasks = [
  { title: "Review PR #142",      tag: "Dev",     color: "blue",  due: "Today" },
  { title: "Design system audit", tag: "Design",  color: "grape", due: "Tomorrow" },
  { title: "Q2 planning meeting", tag: "Meeting", color: "teal",  due: "Apr 29" },
  { title: "Finalize API docs",   tag: "Dev",     color: "blue",  due: "Apr 30" },
];

const activity = [
  { color: BRAND,     text: <><Text span fw={600}>Alice</Text> <Text span c="dimmed">completed task</Text> <Text span fw={600}>&ldquo;Design homepage hero&rdquo;</Text> <Text span c="dimmed">· 2h ago</Text></> },
  { color: "#10b981", text: <><Text span fw={600}>Bob</Text>   <Text span c="dimmed">created project</Text> <Text span fw={600}>&ldquo;Mobile App v2.1&rdquo;</Text> <Text span c="dimmed">· 4h ago</Text></> },
  { color: "#f59e0b", text: <><Text span fw={600}>Carol</Text> <Text span c="dimmed">commented on</Text>   <Text span fw={600}>&ldquo;API rate limiting&rdquo;</Text> <Text span c="dimmed">· 6h ago</Text></> },
  { color: "#3b82f6", text: <><Text span fw={600}>Dave</Text>  <Text span c="dimmed">moved task to</Text>  <Text span fw={600}>In Review</Text> <Text span c="dimmed">· 8h ago</Text></> },
  { color: "#ef4444", text: <><Text span fw={600}>Eve</Text>   <Text span c="dimmed">flagged</Text>        <Text span fw={600}>&ldquo;Data Pipeline&rdquo;</Text> <Text span c="dimmed">as At Risk · 1d ago</Text></> },
];

const helper = createColumnHelper<ProjectRow>();

export default function Dashboard() {
  const columns = useMemo(() => [
    helper.accessor("name", {
      header: "Project",
      size: 260,
      cell: (info) => (
        <Group gap={10} wrap="nowrap">
          <Box style={{ width: "0.25rem", height: "2rem", borderRadius: "0.125rem", background: BRAND, flexShrink: 0 }} />
          <Text fw={600} size="sm" style={{ color: "#0f172a" }} lineClamp={1}>{info.getValue()}</Text>
        </Group>
      ),
    }),
    helper.accessor("status", {
      header: "Status",
      size: 130,
      cell: (info) => (
        <Badge
          color={statusColor[info.getValue()]}
          variant="light"
          size="md"
          radius="sm"
          style={{ fontWeight: 600, fontSize: "0.6875rem", textTransform: "none", letterSpacing: 0 }}
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    helper.accessor("priority", {
      header: "Priority",
      size: 110,
      cell: (info) => (
        <Group gap={6} wrap="nowrap">
          <Box style={{
            width: "0.5rem", height: "0.5rem", borderRadius: "50%", flexShrink: 0,
            background: info.getValue() === "High" ? "#ef4444" : info.getValue() === "Medium" ? "#f59e0b" : "#3b82f6",
          }} />
          <Text size="sm" fw={500} c="dimmed">{info.getValue()}</Text>
        </Group>
      ),
    }),
    helper.accessor("progress", {
      header: "Progress",
      size: 180,
      cell: (info) => (
        <Group gap={8} wrap="nowrap" style={{ width: "100%" }}>
          <Progress
            value={info.getValue()}
            color={info.getValue() === 100 ? "teal" : "indigo"}
            size={6}
            radius="xl"
            style={{ flex: 1 }}
          />
          <Text size="xs" fw={600} style={{ minWidth: "2rem", color: BRAND, textAlign: "right" }}>
            {info.getValue()}%
          </Text>
        </Group>
      ),
    }),
    helper.accessor("due", {
      header: "Due",
      size: 110,
      cell: (info) => (
        <Group gap={6} wrap="nowrap">
          <IconCalendar size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
          <Text size="sm" c="dimmed">{info.getValue()}</Text>
        </Group>
      ),
    }),
    helper.accessor("team", {
      header: "Team",
      size: 120,
      enableSorting: false,
      cell: (info) => (
        <Avatar.Group spacing={-6}>
          {info.getValue().slice(0, 4).map((m) => (
            <Avatar key={m} size={28} style={{ background: BRAND, border: "2px solid #fff" }} radius="xl" fz={10}>{m[0]}</Avatar>
          ))}
        </Avatar.Group>
      ),
    }),
  ], []);

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Group justify="space-between" align="flex-start" mb={24}>
        <Box>
          <Title order={3} style={{ margin: 0 }}>Good morning, Adit 👋</Title>
          <Text c="dimmed" size="sm">Here&apos;s what&apos;s happening with your projects today.</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="indigo" size="md">New Project</Button>
      </Group>

      {/* Stat cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={16} mb={24}>
        {stats.map((s) => (
          <Card key={s.title} shadow="sm" radius="md" p={24} style={{ border: "none" }}>
            <Group justify="space-between" align="flex-start">
              <Box>
                <Text c="dimmed" size="sm" style={{ fontSize: "0.8125rem" }}>{s.title}</Text>
                <Text fw={700} style={{ fontSize: "1.75rem", lineHeight: 1.2 }}>{s.value}</Text>
              </Box>
              <Box style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.625rem", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                <s.icon size={20} />
              </Box>
            </Group>
            <Group gap={4} mt={8}>
              {s.up ? <IconArrowUpRight size={14} color="#10b981" /> : <IconArrowDownRight size={14} color="#ef4444" />}
              <Text size="xs" style={{ color: s.up ? "#10b981" : "#ef4444" }}>{s.change}% vs last month</Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Grid>
        {/* TanStack Table – Active Projects */}
        <Grid.Col span={{ base: 12, xl: 16 }}>
          <Card shadow="sm" radius="md" p={0} style={{ border: "none", overflow: "hidden" }}>
            <Group justify="space-between" p={24} pb={16}>
              <Text fw={700}>Active Projects</Text>
              <Button variant="subtle" size="compact-sm" color="indigo">View all</Button>
            </Group>
            <DataTable
              data={projects}
              columns={columns}
              pinnedLeft={["name"]}
            />
          </Card>
        </Grid.Col>

        {/* Right column */}
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Stack gap={16}>
            <Card shadow="sm" radius="md" p={24} style={{ border: "none" }}>
              <Text fw={700} mb="sm">Upcoming Tasks</Text>
              <Stack gap={0}>
                {upcomingTasks.map((t, i) => (
                  <Group key={t.title} justify="space-between" style={{ padding: "0.625rem 0", borderBottom: i < upcomingTasks.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                    <Group gap={8}>
                      <Badge color={t.color} size="sm" variant="light">{t.tag}</Badge>
                      <Text size="sm">{t.title}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">{t.due}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>

            <Card shadow="sm" radius="md" p={24} style={{ border: "none" }}>
              <Text fw={700} mb="sm">Recent Activity</Text>
              <Timeline active={-1} bulletSize={20} lineWidth={2} mt={8}>
                {activity.map((a, i) => (
                  <Timeline.Item key={i} bullet={<ThemeIcon size={20} radius="xl" style={{ background: a.color }}><IconBolt size={10} /></ThemeIcon>}>
                    <Text size="sm">{a.text}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
