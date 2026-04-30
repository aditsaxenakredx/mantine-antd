"use client";

import { useState } from "react";
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
  SimpleGrid,
  Modal,
  Stack,
  Divider,
  ActionIcon,
  Menu,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconSearch,
  IconUsers,
  IconUser,
  IconCrown,
  IconMail,
  IconEdit,
  IconUserMinus,
  IconDots,
} from "@tabler/icons-react";

const BRAND = "#6366f1";

interface Member {
  key: string;
  name: string;
  role: string;
  email: string;
  department: string;
  status: "Active" | "Away" | "Offline";
  projects: number;
  tasks: number;
  initials: string;
  color: string;
}

const members: Member[] = [
  { key: "1",  name: "Alice Chen",   role: "Lead Designer",      email: "alice@taskflow.io",  department: "Design",      status: "Active",  projects: 4, tasks: 12, initials: "AC", color: "#6366f1" },
  { key: "2",  name: "Bob Martinez", role: "Frontend Engineer",  email: "bob@taskflow.io",    department: "Engineering", status: "Active",  projects: 3, tasks: 8,  initials: "BM", color: "#10b981" },
  { key: "3",  name: "Carol Wu",     role: "Product Manager",    email: "carol@taskflow.io",  department: "Product",     status: "Away",    projects: 6, tasks: 5,  initials: "CW", color: "#f59e0b" },
  { key: "4",  name: "Dave Patel",   role: "Backend Engineer",   email: "dave@taskflow.io",   department: "Engineering", status: "Active",  projects: 2, tasks: 15, initials: "DP", color: "#3b82f6" },
  { key: "5",  name: "Eve Johnson",  role: "iOS Developer",      email: "eve@taskflow.io",    department: "Engineering", status: "Offline", projects: 2, tasks: 7,  initials: "EJ", color: "#8b5cf6" },
  { key: "6",  name: "Frank Kim",    role: "Security Engineer",  email: "frank@taskflow.io",  department: "Engineering", status: "Active",  projects: 2, tasks: 9,  initials: "FK", color: "#ef4444" },
  { key: "7",  name: "Grace Liu",    role: "UX Researcher",      email: "grace@taskflow.io",  department: "Design",      status: "Active",  projects: 3, tasks: 6,  initials: "GL", color: "#06b6d4" },
  { key: "8",  name: "Henry Park",   role: "DevOps Engineer",    email: "henry@taskflow.io",  department: "Engineering", status: "Away",    projects: 1, tasks: 4,  initials: "HP", color: "#84cc16" },
  { key: "9",  name: "Iris Torres",  role: "Data Engineer",      email: "iris@taskflow.io",   department: "Data",        status: "Active",  projects: 1, tasks: 11, initials: "IT", color: "#f97316" },
  { key: "10", name: "Jack Brown",   role: "Analytics Lead",     email: "jack@taskflow.io",   department: "Data",        status: "Active",  projects: 1, tasks: 3,  initials: "JB", color: "#ec4899" },
];

const statusDot: Record<string, string> = { Active: "#10b981", Away: "#f59e0b", Offline: "#94a3b8" };
const statusBadge: Record<string, string> = { Active: "teal", Away: "yellow", Offline: "gray" };

const departments = ["All", ...Array.from(new Set(members.map((m) => m.department)))];

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [invite, setInvite] = useState({ email: "", role: "Member", department: "" });

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || deptFilter === "All" || m.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      {/* Page header */}
      <Group justify="space-between" align="flex-start" mb={24}>
        <Box>
          <Title order={3} style={{ margin: 0 }}>Team</Title>
          <Text c="dimmed" size="sm">{members.length} members across {departments.length - 1} departments</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="indigo" onClick={open}>
          Invite Member
        </Button>
      </Group>

      {/* Summary stats */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={12} mb={24}>
        {[
          { label: "Total Members", value: members.length,                                  icon: IconUsers, color: BRAND,     bg: "#eef2ff" },
          { label: "Active Now",    value: members.filter((m) => m.status === "Active").length, icon: IconUser,  color: "#10b981", bg: "#ecfdf5" },
          { label: "Departments",   value: departments.length - 1,                          icon: IconCrown, color: "#f59e0b", bg: "#fffbeb" },
        ].map((s) => (
          <Card key={s.label} shadow="sm" radius="md" p="md" style={{ border: "none" }}>
            <Group gap={12}>
              <Box
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.625rem",
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                  flexShrink: 0,
                }}
              >
                <s.icon size={18} />
              </Box>
              <Box>
                <Text c="dimmed" size="xs">{s.label}</Text>
                <Text fw={700} style={{ fontSize: "1.5rem" }}>{s.value}</Text>
              </Box>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Members grid */}
      <Card shadow="sm" radius="md" p={24} style={{ border: "none" }}>
        <Group mb={16} gap="sm" wrap="wrap">
          <TextInput
            placeholder="Search members..."
            leftSection={<IconSearch size={16} color="#94a3b8" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 auto", minWidth: "9rem", maxWidth: "15rem" }}
          />
          <Select
            placeholder="All Departments"
            clearable
            value={deptFilter}
            onChange={setDeptFilter}
            data={departments}
            style={{ width: "11.25rem" }}
          />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={12}>
          {filtered.map((m) => (
            <Card
              key={m.key}
              radius="md"
              p={16}
              style={{ border: "1px solid #f0f0f0" }}
            >
              <Group justify="space-between" align="flex-start">
                <Box style={{ position: "relative", display: "inline-block" }}>
                  <Avatar size={48} style={{ background: m.color, fontWeight: 600 }} radius="xl">
                    {m.initials}
                  </Avatar>
                  <Box
                    style={{
                      position: "absolute",
                      bottom: "0.0625rem",
                      right: "0.0625rem",
                      width: "0.625rem",
                      height: "0.625rem",
                      borderRadius: "50%",
                      background: statusDot[m.status],
                      border: "2px solid #fff",
                    }}
                  />
                </Box>
                <Menu shadow="sm" width={160}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray"><IconDots size={16} /></ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEdit size={14} />}>Edit Member</Menu.Item>
                    <Menu.Item leftSection={<IconMail size={14} />}>Send Email</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<IconUserMinus size={14} />} color="red">Remove</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Box mt={10}>
                <Group gap={4}>
                  <Text fw={700} size="sm">{m.name}</Text>
                  {m.role.startsWith("Lead") && <IconCrown size={11} color="#f59e0b" />}
                </Group>
                <Text c="dimmed" size="xs">{m.role}</Text>
              </Box>

              <Divider my={10} />

              <Group gap={8} wrap="wrap">
                <Badge color="blue" size="xs" variant="light">{m.department}</Badge>
                <Badge color={statusBadge[m.status]} size="xs" variant="light">{m.status}</Badge>
              </Group>

              <Group justify="space-between" mt={10}>
                <Text c="dimmed" size="xs">📁 {m.projects} projects</Text>
                <Text c="dimmed" size="xs">✓ {m.tasks} tasks</Text>
              </Group>

              <Anchor
                href={`mailto:${m.email}`}
                size="xs"
                style={{ color: BRAND, display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem" }}
              >
                <IconMail size={12} /> {m.email}
              </Anchor>
            </Card>
          ))}
        </SimpleGrid>
      </Card>

      {/* Invite modal */}
      <Modal opened={opened} onClose={close} title="Invite Team Member" centered size="sm">
        <Stack gap="sm" mt={8}>
          <TextInput
            label="Email Address"
            placeholder="colleague@company.com"
            required
            leftSection={<IconMail size={16} />}
            value={invite.email}
            onChange={(e) => setInvite({ ...invite, email: e.target.value })}
          />
          <Select
            label="Role"
            required
            value={invite.role}
            onChange={(v) => setInvite({ ...invite, role: v ?? "Member" })}
            data={[{ value: "admin", label: "Admin" }, { value: "member", label: "Member" }, { value: "viewer", label: "Viewer" }]}
          />
          <Select
            label="Department"
            value={invite.department}
            onChange={(v) => setInvite({ ...invite, department: v ?? "" })}
            data={departments.slice(1)}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="indigo" onClick={close}>Send Invite</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
