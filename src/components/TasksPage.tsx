"use client";

import { useState, useMemo, useCallback } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Box,
  Title,
  Text,
  Group,
  Button,
  SegmentedControl,
  Card,
  Badge,
  Avatar,
  Stack,
  Checkbox,
  Modal,
  TextInput,
  Select,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconLayoutKanban,
  IconList,
  IconClock,
} from "@tabler/icons-react";
import { DataTable } from "./DataTable";

const BRAND = "#6366f1";

interface Task {
  key: string;
  title: string;
  project: string;
  assignee: string;
  priority: string;
  status: string;
  due: string;
  done: boolean;
}

const STATUSES = ["Todo", "In Progress", "In Review", "Done"];
const priorityColor: Record<string, string> = { High: "red", Medium: "orange", Low: "blue" };
const statusColor: Record<string, string> = { Todo: "gray", "In Progress": "indigo", "In Review": "yellow", Done: "teal" };

const initialTasks: Task[] = [
  { key: "1", title: "Design homepage hero section",       project: "Website Redesign",    assignee: "Alice", priority: "High",   status: "Done",        due: "Apr 24", done: true  },
  { key: "2", title: "Implement auth flow with SSO",        project: "Auth Revamp",         assignee: "Frank", priority: "High",   status: "In Progress", due: "Apr 29", done: false },
  { key: "3", title: "Set up CI/CD pipeline",               project: "API Integration",     assignee: "Henry", priority: "Medium", status: "Todo",        due: "May 3",  done: false },
  { key: "4", title: "Write unit tests for payment module", project: "Mobile App v2",       assignee: "Dave",  priority: "Medium", status: "In Review",   due: "Apr 27", done: false },
  { key: "5", title: "Optimize database queries",           project: "Data Pipeline",       assignee: "Iris",  priority: "High",   status: "In Progress", due: "Apr 30", done: false },
  { key: "6", title: "Create onboarding email sequence",    project: "Website Redesign",    assignee: "Carol", priority: "Low",    status: "Todo",        due: "May 10", done: false },
  { key: "7", title: "Build push notification service",     project: "Mobile App v2",       assignee: "Eve",   priority: "Medium", status: "Todo",        due: "May 5",  done: false },
  { key: "8", title: "Migrate legacy dashboard",            project: "Dashboard Analytics", assignee: "Jack",  priority: "Low",    status: "Done",        due: "Apr 20", done: true  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState("Board");
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({ title: "", project: "", assignee: "", priority: "Medium", due: "" });

  const toggleDone = useCallback((key: string) => {
    setTasks((prev) =>
      prev.map((t) => t.key === key ? { ...t, done: !t.done, status: !t.done ? "Done" : "In Progress" } : t)
    );
  }, []);

  const handleCreate = () => {
    if (!form.title) return;
    setTasks((prev) => [{ key: Date.now().toString(), ...form, status: "Todo", done: false }, ...prev]);
    setForm({ title: "", project: "", assignee: "", priority: "Medium", due: "" });
    close();
  };

  const helper = useMemo(() => createColumnHelper<Task>(), []);

  const columns = useMemo(() => [
    helper.accessor("done", {
      id: "done",
      header: "",
      size: 52,
      enableSorting: false,
      cell: (info) => (
        <Checkbox
          checked={info.getValue()}
          onChange={() => toggleDone(info.row.original.key)}
          color="indigo"
        />
      ),
    }),
    helper.accessor("title", {
      id: "title",
      header: "Task",
      size: 280,
      cell: (info) => (
        <Text
          fw={info.row.original.done ? 400 : 600}
          size="sm"
          td={info.row.original.done ? "line-through" : undefined}
          c={info.row.original.done ? "dimmed" : "#0f172a"}
          lineClamp={1}
        >
          {info.getValue()}
        </Text>
      ),
    }),
    helper.accessor("project", {
      header: "Project",
      size: 180,
      cell: (info) => (
        <Badge variant="outline" color="gray" size="sm" radius="sm" style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
          {info.getValue()}
        </Badge>
      ),
    }),
    helper.accessor("assignee", {
      header: "Assignee",
      size: 150,
      cell: (info) => (
        <Group gap={8} wrap="nowrap">
          <Avatar size={26} style={{ background: BRAND, border: "2px solid #fff", boxShadow: "0 0 0 1px #e2e8f0" }} radius="xl" fz={10}>{info.getValue()[0]}</Avatar>
          <Text size="sm" fw={500}>{info.getValue()}</Text>
        </Group>
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
    helper.accessor("due", {
      id: "due",
      header: "Due",
      size: 110,
      cell: (info) => (
        <Group gap={6} wrap="nowrap">
          <IconClock size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
          <Text size="sm" c="dimmed">{info.getValue()}</Text>
        </Group>
      ),
    }),
  ], [helper, toggleDone]);

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Group justify="space-between" align="flex-start" mb={24}>
        <Box>
          <Title order={3} style={{ margin: 0 }}>Tasks</Title>
          <Text c="dimmed" size="sm">{tasks.filter((t) => !t.done).length} tasks remaining</Text>
        </Box>
        <Group gap={8}>
          <SegmentedControl
            value={view}
            onChange={setView}
            data={[
              { value: "Board", label: <Group gap={4}><IconLayoutKanban size={14} /><Text size="sm">Board</Text></Group> },
              { value: "List",  label: <Group gap={4}><IconList size={14} /><Text size="sm">List</Text></Group> },
            ]}
          />
          <Button leftSection={<IconPlus size={16} />} color="indigo" onClick={open}>
            Add Task
          </Button>
        </Group>
      </Group>

      {/* Board view */}
      {view === "Board" && (
        <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {STATUSES.map((status) => {
            const col = tasks.filter((t) => t.status === status);
            return (
              <div key={status} style={{ flex: 1, minWidth: "15rem", background: "#f1f5f9", borderRadius: "0.625rem", padding: "0.75rem" }}>
                <Group justify="space-between" mb={12}>
                  <Group gap={6}>
                    <Badge color={statusColor[status]} variant="dot" size="sm" />
                    <Text fw={600} size="sm">{status}</Text>
                  </Group>
                  <Text c="dimmed" size="xs">{col.length}</Text>
                </Group>

                {col.length === 0 ? (
                  <Box style={{ textAlign: "center", padding: "1.5rem 0" }}>
                    <Text size="xs" c="dimmed">No tasks</Text>
                  </Box>
                ) : (
                  <Stack gap={8}>
                    {col.map((t) => (
                      <Card key={t.key} shadow="sm" radius="md" p="sm" style={{ cursor: "pointer", border: "none" }}>
                        <Text size="sm" mb={8}>{t.title}</Text>
                        <Group justify="space-between">
                          <Badge color={priorityColor[t.priority]} size="xs" variant="light">{t.priority}</Badge>
                          <Group gap={6}>
                            <Tooltip label={t.assignee}>
                              <Avatar size={20} style={{ background: BRAND, fontSize: "0.625rem" }} radius="xl">{t.assignee[0]}</Avatar>
                            </Tooltip>
                            <Text c="dimmed" size="xs">{t.due}</Text>
                          </Group>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === "List" && (
        <Card shadow="sm" radius="md" p={0} style={{ border: "none", overflow: "hidden" }}>
          <DataTable
            data={tasks}
            columns={columns}
            pinnedLeft={["done", "title"]}
            pinnedRight={["due"]}
            pagination
            pageSize={10}
          />
        </Card>
      )}

      {/* Add task modal */}
      <Modal opened={opened} onClose={close} title="Add New Task" centered size="md">
        <Stack gap="sm" mt={8}>
          <TextInput label="Task Title" placeholder="What needs to be done?" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Group grow>
            <Select label="Project" placeholder="Select project" value={form.project} onChange={(v) => setForm({ ...form, project: v ?? "" })} data={["Website Redesign", "Mobile App v2", "API Integration", "Data Pipeline", "Auth Revamp"]} />
            <Select label="Assignee" placeholder="Assign to" value={form.assignee} onChange={(v) => setForm({ ...form, assignee: v ?? "" })} data={["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"]} />
          </Group>
          <Group grow>
            <Select label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v ?? "Medium" })} data={["High", "Medium", "Low"]} />
            <TextInput label="Due Date" placeholder="e.g. May 10" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="indigo" onClick={handleCreate}>Add Task</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
