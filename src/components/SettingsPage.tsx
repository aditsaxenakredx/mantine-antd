"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import {
  Box,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Switch,
  Card,
  Avatar,
  Tabs,
  Stack,
  PasswordInput,
  Divider,
  Badge,
  SimpleGrid,
  FileButton,
  Alert,
} from "@mantine/core";
import {
  IconUser,
  IconBell,
  IconLock,
  IconUsers,
  IconCreditCard,
  IconUpload,
  IconPlus,
  IconInfoCircle,
  IconCheck,
} from "@tabler/icons-react";

const BRAND = "#6366f1";

function ProfileTab() {
  return (
    <Box style={{ maxWidth: "35rem" }}>
      <Group mb={24} gap={16}>
        <Avatar size={72} style={{ background: BRAND, fontSize: "1.5rem", fontWeight: 600 }} radius="xl">AS</Avatar>
        <Box>
          <FileButton accept="image/*" onChange={() => {}}>
            {(props) => (
              <Button {...props} size="sm" variant="outline" leftSection={<IconUpload size={14} />} color="gray">
                Change Photo
              </Button>
            )}
          </FileButton>
          <Text c="dimmed" size="xs" mt={4}>JPG, PNG or GIF. Max 2MB.</Text>
        </Box>
      </Group>
      <Stack gap="sm">
        <Group grow>
          <TextInput label="Full Name" defaultValue="Adit Saxena" leftSection={<IconUser size={14} />} />
          <TextInput label="Email Address" defaultValue="aditsaxena2004@gmail.com" />
        </Group>
        <Group grow>
          <TextInput label="Role" defaultValue="Admin" disabled />
          <Select label="Timezone" defaultValue="Asia/Kolkata" data={["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"]} />
        </Group>
        <Textarea label="Bio" placeholder="Tell your team about yourself..." rows={3} />
        <Group>
          <Button color="indigo">Save Changes</Button>
        </Group>
      </Stack>
    </Box>
  );
}

function NotificationsTab() {
  const notifs = [
    { key: "task_assigned",  label: "Task Assigned",       desc: "When a task is assigned to you",     email: true,  push: true  },
    { key: "task_due",       label: "Task Due Reminder",   desc: "24h before a task is due",           email: true,  push: false },
    { key: "project_update", label: "Project Updates",     desc: "Status changes on your projects",    email: true,  push: true  },
    { key: "comments",       label: "Comments & Mentions", desc: "When someone mentions you",          email: false, push: true  },
    { key: "weekly",         label: "Weekly Summary",      desc: "Your weekly activity digest",        email: true,  push: false },
  ];

  return (
    <Box style={{ maxWidth: "35rem" }}>
      <Alert icon={<IconInfoCircle size={16} />} color="blue" mb={20}>
        Changes are saved automatically
      </Alert>
      {notifs.map((n, i) => (
        <Box key={n.key}>
          <Group justify="space-between" style={{ padding: "0.875rem 0" }}>
            <Box>
              <Text fw={600} style={{ display: "block" }}>{n.label}</Text>
              <Text c="dimmed" size="xs">{n.desc}</Text>
            </Box>
            <Group gap={16}>
              <Box style={{ textAlign: "center" }}>
                <Text c="dimmed" size="xs" style={{ display: "block" }}>Email</Text>
                <Switch defaultChecked={n.email} color="indigo" size="sm" />
              </Box>
              <Box style={{ textAlign: "center" }}>
                <Text c="dimmed" size="xs" style={{ display: "block" }}>Push</Text>
                <Switch defaultChecked={n.push} color="indigo" size="sm" />
              </Box>
            </Group>
          </Group>
          {i < notifs.length - 1 && <Divider style={{ margin: 0 }} />}
        </Box>
      ))}
    </Box>
  );
}

function SecurityTab() {
  return (
    <Box style={{ maxWidth: "30rem" }}>
      <Card
        radius="md"
        p="md"
        mb={16}
        style={{ background: "#f8fafc", border: "1px solid #f0f0f0" }}
      >
        <Text fw={600} mb="sm">Change Password</Text>
        <Stack gap="sm">
          <PasswordInput label="Current Password" />
          <PasswordInput label="New Password" />
          <PasswordInput label="Confirm New Password" />
          <Group>
            <Button color="indigo" leftSection={<IconLock size={14} />}>Update Password</Button>
          </Group>
        </Stack>
      </Card>

      <Card
        radius="md"
        p="md"
        style={{ background: "#f8fafc", border: "1px solid #f0f0f0" }}
      >
        <Text fw={600} mb="sm">Two-Factor Authentication</Text>
        <Group justify="space-between" style={{ padding: "0.5rem 0" }}>
          <Box>
            <Text fw={600} size="sm">Authenticator App</Text>
            <Text c="dimmed" size="xs">Use an app like Google Authenticator</Text>
          </Box>
          <Switch defaultChecked color="indigo" />
        </Group>
        <Divider style={{ margin: "0.75rem 0" }} />
        <Group justify="space-between" style={{ padding: "0.5rem 0" }}>
          <Box>
            <Text fw={600} size="sm">SMS Authentication</Text>
            <Text c="dimmed" size="xs">Receive codes via text message</Text>
          </Box>
          <Switch color="indigo" />
        </Group>
      </Card>
    </Box>
  );
}

interface ApiKey { name: string; created: string; lastUsed: string; }

const apiKeyHelper = createColumnHelper<ApiKey>();

function ApiKeysGrid({ apiKeys }: { apiKeys: ApiKey[] }) {
  const columns = useMemo(() => [
    apiKeyHelper.accessor("name", {
      header: "Name",
      size: 260,
      cell: (info) => <Text size="sm" fw={600}>{info.getValue()}</Text>,
    }),
    apiKeyHelper.accessor("created", {
      header: "Created",
      size: 160,
      cell: (info) => <Text size="sm" c="dimmed">{info.getValue()}</Text>,
    }),
    apiKeyHelper.accessor("lastUsed", {
      header: "Last Used",
      size: 160,
      cell: (info) => <Text size="sm" c="dimmed">{info.getValue()}</Text>,
    }),
    apiKeyHelper.display({
      id: "status",
      header: "Status",
      size: 100,
      enableSorting: false,
      cell: () => <Badge color="teal" size="sm" variant="light">Active</Badge>,
    }),
    apiKeyHelper.display({
      id: "actions",
      header: "",
      size: 170,
      enableSorting: false,
      cell: () => (
        <Group gap={4}>
          <Button size="xs" variant="default">Regenerate</Button>
          <Button size="xs" color="red" variant="light">Revoke</Button>
        </Group>
      ),
    }),
  ], []);

  return <DataTable data={apiKeys} columns={columns} />;
}

function BillingTab() {
  const plans = [
    { name: "Starter",    price: "$0",     features: ["5 projects", "3 team members", "1GB storage"],                                            current: false },
    { name: "Pro",        price: "$29/mo", features: ["Unlimited projects", "25 team members", "50GB storage", "Priority support"],               current: true  },
    { name: "Enterprise", price: "Custom", features: ["Unlimited everything", "SSO & SAML", "Custom integrations", "Dedicated support"],          current: false },
  ];

  const apiKeys = [
    { name: "Production API Key", created: "Jan 15, 2025", lastUsed: "Apr 27, 2025" },
    { name: "Development Key",    created: "Mar 2, 2025",  lastUsed: "Apr 26, 2025" },
    { name: "CI/CD Pipeline",     created: "Feb 10, 2025", lastUsed: "Apr 20, 2025" },
  ];

  return (
    <Box>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={12} mb={24}>
        {plans.map((p) => (
          <Card
            key={p.name}
            radius="md"
            p="md"
            style={{
              border: p.current ? `2px solid ${BRAND}` : "1px solid #f0f0f0",
            }}
          >
            <Group justify="space-between" mb={4}>
              <Text fw={700} size="md">{p.name}</Text>
              {p.current && <Badge color="indigo" size="sm">Current</Badge>}
            </Group>
            <Title order={2} style={{ color: BRAND, margin: "0.5rem 0 1rem" }}>{p.price}</Title>
            <Stack gap={4} mb="md">
              {p.features.map((f) => (
                <Group key={f} gap={6}>
                  <IconCheck size={12} color="#10b981" />
                  <Text c="dimmed" size="xs">{f}</Text>
                </Group>
              ))}
            </Stack>
            <Button
              fullWidth
              color="indigo"
              variant={p.current ? "light" : "filled"}
              disabled={p.current}
            >
              {p.current ? "Current Plan" : p.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      <Card
        radius="md"
        p="md"
        style={{ border: "none" }}
        shadow="sm"
      >
        <Group justify="space-between" mb="sm">
          <Text fw={600}>API Keys</Text>
          <Button size="xs" leftSection={<IconPlus size={12} />} variant="outline" color="indigo">New Key</Button>
        </Group>
        <ApiKeysGrid apiKeys={apiKeys} />
      </Card>
    </Box>
  );
}

export default function SettingsPage() {
  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Box mb={24}>
        <Title order={3} style={{ margin: 0 }}>Settings</Title>
        <Text c="dimmed" size="sm">Manage your account and workspace preferences</Text>
      </Box>

      <Card shadow="sm" radius="md" p={0} style={{ border: "none" }}>
        <Tabs defaultValue="profile" orientation="vertical" keepMounted={false}>
          <Tabs.List style={{ minWidth: "11.25rem", borderRight: "1px solid #f0f0f0", padding: "0.5rem 0" }}>
            <Tabs.Tab value="profile"       leftSection={<IconUser size={16} />}       py="sm">Profile</Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}       py="sm">Notifications</Tabs.Tab>
            <Tabs.Tab value="security"      leftSection={<IconLock size={16} />}       py="sm">Security</Tabs.Tab>
            <Tabs.Tab value="team"          leftSection={<IconUsers size={16} />}      py="sm">Team & Access</Tabs.Tab>
            <Tabs.Tab value="billing"       leftSection={<IconCreditCard size={16} />} py="sm">Billing</Tabs.Tab>
          </Tabs.List>
          <Box p={24} style={{ flex: 1 }}>
            <Tabs.Panel value="profile">       <ProfileTab /></Tabs.Panel>
            <Tabs.Panel value="notifications"> <NotificationsTab /></Tabs.Panel>
            <Tabs.Panel value="security">      <SecurityTab /></Tabs.Panel>
            <Tabs.Panel value="team">          <Text c="dimmed">Team management settings coming soon.</Text></Tabs.Panel>
            <Tabs.Panel value="billing">       <BillingTab /></Tabs.Panel>
          </Box>
        </Tabs>
      </Card>
    </Box>
  );
}
