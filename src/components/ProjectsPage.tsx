"use client";

import { useState, useMemo, useCallback } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Box,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Select,
  Card,
  Badge,
  Avatar,
  Progress,
  SimpleGrid,
  Modal,
  Textarea,
  Stack,
  Tooltip,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconSearch,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconFolderOpen,
  IconCircleCheck,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react";
import { DataTable } from "./DataTable";

const BRAND = "#6366f1";

interface Project {
  key: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  due: string;
  team: string[];
  tasks: number;
  tasksCompleted: number;
}

const initialProjects: Project[] = [
  { key: "1", name: "Website Redesign",   description: "Full redesign of the marketing site",      status: "On Track",  priority: "High",   progress: 72,  due: "2025-05-15", team: ["Alice", "Bob", "Carol"],    tasks: 24, tasksCompleted: 17 },
  { key: "2", name: "Mobile App v2",       description: "New features for iOS & Android",            status: "At Risk",   priority: "High",   progress: 45,  due: "2025-05-28", team: ["Dave", "Eve"],             tasks: 38, tasksCompleted: 17 },
  { key: "3", name: "API Integration",     description: "Third-party payment gateway integration",   status: "On Track",  priority: "Medium", progress: 88,  due: "2025-04-30", team: ["Frank", "Grace", "Henry"], tasks: 16, tasksCompleted: 14 },
  { key: "4", name: "Data Pipeline",       description: "Real-time analytics data pipeline",         status: "Delayed",   priority: "Medium", progress: 31,  due: "2025-06-10", team: ["Iris"],                    tasks: 20, tasksCompleted: 6  },
  { key: "5", name: "Dashboard Analytics", description: "Reporting dashboard for business metrics",  status: "Completed", priority: "Low",    progress: 100, due: "2025-04-20", team: ["Jack", "Kim"],             tasks: 12, tasksCompleted: 12 },
  { key: "6", name: "Auth Revamp",         description: "SSO and MFA implementation",                status: "On Track",  priority: "High",   progress: 60,  due: "2025-06-01", team: ["Alice", "Frank"],          tasks: 10, tasksCompleted: 6  },
];

const statusColor: Record<string, string> = {
  "On Track": "teal", "At Risk": "yellow", "Delayed": "red", "Completed": "gray",
};

const summaryStats = [
  { label: "Total",    value: 6, icon: IconFolderOpen,    color: BRAND,     bg: "#eef2ff" },
  { label: "On Track", value: 3, icon: IconCircleCheck,   color: "#10b981", bg: "#ecfdf5" },
  { label: "At Risk",  value: 1, icon: IconAlertTriangle, color: "#f59e0b", bg: "#fffbeb" },
  { label: "Delayed",  value: 1, icon: IconClock,         color: "#ef4444", bg: "#fef2f2" },
];

const helper = createColumnHelper<Project>();

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({ name: "", description: "", priority: "Medium" as string, due: "" });

  const filtered = useMemo(() => projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchPriority = !priorityFilter || p.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  }), [projects, search, statusFilter, priorityFilter]);

  const handleDelete = useCallback((key: string) => {
    setProjects((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const handleCreate = () => {
    if (!form.name) return;
    setProjects((prev) => [
      { key: Date.now().toString(), name: form.name, description: form.description, status: "On Track", priority: form.priority, progress: 0, due: form.due, team: [], tasks: 0, tasksCompleted: 0 },
      ...prev,
    ]);
    setForm({ name: "", description: "", priority: "Medium", due: "" });
    close();
  };

  const columns = useMemo(() => [
    helper.accessor("name", {
      header: "Project",
      size: 280,
      cell: (info) => (
        <Group gap={12} wrap="nowrap">
          <Box style={{ width: "0.25rem", height: "2.25rem", borderRadius: "0.125rem", background: BRAND, flexShrink: 0 }} />
          <Box style={{ overflow: "hidden", minWidth: 0 }}>
            <Text fw={600} size="sm" style={{ color: "#0f172a", lineHeight: 1.4 }} lineClamp={1}>{info.getValue()}</Text>
            <Text c="dimmed" size="xs" style={{ lineHeight: 1.3 }} lineClamp={1}>{info.row.original.description}</Text>
          </Box>
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
      size: 200,
      cell: (info) => {
        const row = info.row.original;
        return (
          <Box style={{ width: "100%", overflow: "hidden" }}>
            <Group gap={8} mb={3} wrap="nowrap">
              <Progress value={info.getValue()} color="indigo" size={6} radius="xl" style={{ flex: 1 }} />
              <Text size="xs" fw={600} style={{ minWidth: "2rem", color: BRAND, textAlign: "right", flexShrink: 0 }}>{info.getValue()}%</Text>
            </Group>
            <Text size="xs" c="dimmed">{row.tasksCompleted}/{row.tasks} tasks</Text>
          </Box>
        );
      },
    }),
    helper.accessor("due", {
      header: "Due",
      size: 120,
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
          {info.getValue().slice(0, 3).map((m) => (
            <Tooltip label={m} key={m}>
              <Avatar size={28} style={{ background: BRAND, border: "2px solid #fff" }} radius="xl" fz={11}>{m[0]}</Avatar>
            </Tooltip>
          ))}
          {info.getValue().length > 3 && (
            <Avatar size={28} style={{ background: "#e2e8f0", color: "#64748b", border: "2px solid #fff" }} radius="xl" fz={11}>
              +{info.getValue().length - 3}
            </Avatar>
          )}
        </Avatar.Group>
      ),
    }),
    helper.display({
      id: "actions",
      header: "",
      size: 52,
      enableSorting: false,
      cell: (info) => (
        <Menu shadow="md" width={160} withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" radius="md"><IconDots size={16} /></ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>Edit</Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(info.row.original.key)}>Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    }),
  ], [handleDelete]);

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Group justify="space-between" align="flex-start" mb={24}>
        <Box>
          <Title order={3} style={{ margin: 0 }}>Projects</Title>
          <Text c="dimmed" size="sm">Manage and track all your projects</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="indigo" onClick={open}>
          New Project
        </Button>
      </Group>

      {/* Summary stats */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={12} mb={24}>
        {summaryStats.map((s) => (
          <Card key={s.label} shadow="sm" radius="md" p="sm" style={{ border: "none" }}>
            <Group gap={12}>
              <Box style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                <s.icon size={18} />
              </Box>
              <Box>
                <Text c="dimmed" size="xs">{s.label}</Text>
                <Text fw={700} style={{ fontSize: "1.375rem" }}>{s.value}</Text>
              </Box>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Table card */}
      <Card shadow="sm" radius="md" p={24} style={{ border: "none" }}>
        <Group mb={16} gap="sm" wrap="wrap">
          <TextInput
            placeholder="Search projects..."
            leftSection={<IconSearch size={16} color="#94a3b8" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 auto", minWidth: "9rem", maxWidth: "15rem" }}
          />
          <Select
            placeholder="All Statuses"
            clearable
            value={statusFilter}
            onChange={setStatusFilter}
            data={["On Track", "At Risk", "Delayed", "Completed"]}
            style={{ width: "9.375rem" }}
          />
          <Select
            placeholder="All Priorities"
            clearable
            value={priorityFilter}
            onChange={setPriorityFilter}
            data={["High", "Medium", "Low"]}
            style={{ width: "8.75rem" }}
          />
        </Group>

        <Box style={{ margin: "0 -1.5rem" }}>
          <DataTable
            data={filtered}
            columns={columns}
            pinnedLeft={["name"]}
            pinnedRight={["actions"]}
            pagination
            pageSize={10}
            rowHeight="3.625rem"
          />
        </Box>
      </Card>

      {/* Create modal */}
      <Modal opened={opened} onClose={close} title="Create New Project" centered size="md">
        <Stack gap="sm" mt={8}>
          <TextInput label="Project Name" placeholder="e.g. Website Redesign" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" placeholder="Brief project description..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Group grow>
            <Select label="Priority" required value={form.priority} onChange={(v) => setForm({ ...form, priority: v ?? "Medium" })} data={["High", "Medium", "Low"]} />
            <TextInput label="Due Date" placeholder="YYYY-MM-DD" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="indigo" onClick={handleCreate}>Create Project</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
