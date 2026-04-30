"use client";

import {
  Box,
  Title,
  Text,
  Card,
  SimpleGrid,
  Group,
  Badge,
  Stack,
  Divider,
  ThemeIcon,
  List,
  Table,
} from "@mantine/core";
import {
  IconFlask,
  IconBulb,
  IconTrendingUp,
  IconShieldCheck,
  IconCircleCheck,
  IconPalette,
  IconTypography,
  IconLayoutGrid,
  IconComponents,
} from "@tabler/icons-react";

const BRAND = "#6366f1";

const principles = [
  {
    color: BRAND,
    icon: IconFlask,
    name: "Natural",
    tagline: "Align with natural laws and human expectations",
    description:
      "Interactions follow real-world metaphors. Proximity groups related items. Visual hierarchy mirrors importance. Elements behave predictably — hover reveals affordances, clicks produce immediate feedback, transitions feel physical.",
    examples: [
      "Sidebar collapses like a physical drawer, preserving context",
      "Table rows highlight on hover, signaling interactivity",
      "Badges appear on the bell icon, mirroring notification trays",
      "Progress bars fill left-to-right, following reading direction",
    ],
  },
  {
    color: "#10b981",
    icon: IconShieldCheck,
    name: "Certain",
    tagline: "Reduce uncertainty through clear affordances and feedback",
    description:
      "Every action has a visible consequence. Confirmation states, loading indicators, and success/error messages eliminate ambiguity. Disabled states communicate unavailability. Tooltips surface hidden context.",
    examples: [
      "Inline AG Grid edit shows input immediately on cell click",
      "Status badges (Active, On Leave, Inactive) use semantic color",
      "Edit mode banner tells the user exactly how to interact",
      "Collapsed sidebar shows tooltips for hidden labels",
    ],
  },
  {
    color: "#f59e0b",
    icon: IconBulb,
    name: "Meaningful",
    tagline: "Every element earns its place through purpose",
    description:
      "No decorative excess. Every border, shadow, and color serves a function. Whitespace is intentional — it groups, separates, and breathes. Data ink is maximized; chart junk is eliminated.",
    examples: [
      "Card borders removed — shadow alone distinguishes surfaces",
      "Header uses only one dividing border, not redundant shadows",
      "Stat cards show delta percentage with directional arrows",
      "Avatar groups show max 3 members + overflow count",
    ],
  },
  {
    color: "#3b82f6",
    icon: IconTrendingUp,
    name: "Growing",
    tagline: "Design scales with complexity without breaking",
    description:
      "The system accommodates growth: more projects, more team members, longer task lists. Pagination, virtualization, and collapse patterns let the UI scale. New pages follow established patterns without custom work.",
    examples: [
      "AG Grid handles thousands of rows with pagination built-in",
      "Kanban columns flex-grow to fill available space evenly",
      "Search + filter pattern is consistent across all data pages",
      "Navigation items can grow — sidebar scrolls if needed",
    ],
  },
];

const designDecisions = [
  { area: "Color",      decision: "Single primary (#6366f1 Indigo)",              reason: "Restraint — one brand color prevents visual noise" },
  { area: "Grid",       decision: "8px base unit throughout",                     reason: "Consistent rhythm: 8, 16, 24, 32px feels mathematical" },
  { area: "Typography", decision: "System sans-serif, 3 weights (400/600/700)",   reason: "System font avoids overhead; weights alone create hierarchy" },
  { area: "Sidebar",    decision: "Dark (#0f172a), collapsible, 240/80px",        reason: "Dark reduces cognitive load; collapse preserves context" },
  { area: "Cards",      decision: "Shadow sm, no borders, radius 8px",            reason: "Elevation over borders; neutral radius for functional feel" },
  { area: "Tables",     decision: "AG Grid with Mantine cell renderers",          reason: "AG Grid handles sorting & pagination; Mantine keeps design consistent" },
  { area: "Buttons",    decision: "Filled for primary CTA, default for secondary", reason: "Two-tier hierarchy — filled draws eye to the main action" },
  { area: "Density",    decision: "44px header rows, 52px data rows",             reason: "Comfortable reading density, not cramped, not wasteful" },
];

const library = "Mantine v9 — AntD Design Principles";

export default function PrinciplesPage() {
  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Box mb={32}>
        <Group gap={10} mb={4}>
          <Title order={3} style={{ margin: 0 }}>Design Principles</Title>
          <Badge color="indigo" variant="light" size="sm">Prototype 2</Badge>
        </Group>
        <Text c="dimmed" size="sm">
          <Text span fw={600} c="dark">{library}</Text>
          {" "}— Mantine UI components styled according to Ant Design&apos;s four core principles.
          This prototype demonstrates that design principles are implementation-agnostic:
          the same philosophy works whether you use AntD or Mantine as the component library.
        </Text>
      </Box>

      {/* Principle cards */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={16} mb={32}>
        {principles.map((p) => (
          <Card key={p.name} shadow="sm" radius="md" p="lg" style={{ border: "none" }}>
            <Group gap={12} mb={12}>
              <ThemeIcon size={40} radius="md" style={{ background: p.color }}>
                <p.icon size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={700} size="sm">{p.name}</Text>
                <Text c="dimmed" size="xs">{p.tagline}</Text>
              </Box>
            </Group>
            <Text size="sm" c="dimmed" mb={12} style={{ lineHeight: 1.6 }}>
              {p.description}
            </Text>
            <Stack gap={4}>
              {p.examples.map((ex) => (
                <Group key={ex} gap={6} align="flex-start">
                  <IconCircleCheck size={13} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text size="xs" c="dimmed">{ex}</Text>
                </Group>
              ))}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Divider mb={24} />

      {/* Design decisions */}
      <Title order={4} mb={16}>Design Decisions Reference</Title>
      <Card shadow="sm" radius="md" p={0} style={{ border: "none" }} mb={24}>
        <Table>
          <Table.Thead style={{ background: "#f8fafc" }}>
            <Table.Tr>
              {["Area", "Decision", "Reason"].map((h) => (
                <Table.Th key={h} style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#64748b", padding: "0.75rem 1rem" }}>
                  {h}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {designDecisions.map((d) => (
              <Table.Tr key={d.area}>
                <Table.Td style={{ padding: "0.75rem 1rem" }}>
                  <Badge color="indigo" variant="light" size="sm">{d.area}</Badge>
                </Table.Td>
                <Table.Td style={{ padding: "0.75rem 1rem" }}>
                  <Text fw={600} size="sm">{d.decision}</Text>
                </Table.Td>
                <Table.Td style={{ padding: "0.75rem 1rem" }}>
                  <Text c="dimmed" size="sm">{d.reason}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Divider mb={24} />

      {/* Visual language */}
      <Title order={4} mb={16}>Visual Language</Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16}>
        {[
          {
            icon: IconPalette,
            title: "Color Palette",
            items: [
              "#6366f1 — Primary (Indigo)",
              "#0f172a — Sidebar background",
              "#f8fafc — Content background",
              "#10b981 — Success / Active",
              "#ef4444 — Danger / Error",
              "#f59e0b — Warning / At Risk",
            ],
          },
          {
            icon: IconTypography,
            title: "Typography Scale",
            items: [
              "1.75rem / 700 — Page titles",
              "1.25rem / 600 — Card headings",
              "0.875rem / 600 — Labels & section titles",
              "0.8125rem / 400 — Body text",
              "0.75rem / 400 — Secondary / dimmed text",
              "0.6875rem / 400 — Captions & metadata",
            ],
          },
          {
            icon: IconLayoutGrid,
            title: "Spacing System (0.5rem grid)",
            items: [
              "0.25rem — Icon gaps, tight groupings",
              "0.5rem — Inline element spacing",
              "0.75rem — Component internal padding",
              "1rem — Card padding (compact)",
              "1.5rem — Page padding, section gaps",
              "2rem — Major section separation",
            ],
          },
          {
            icon: IconComponents,
            title: "Component Tokens",
            items: [
              "Border radius — 0.5rem (default)",
              "Card shadow — sm",
              "Header height — 4rem",
              "Sidebar — 15rem / 5rem collapsed",
              "Table data row — 3.375rem",
              "Table header row — 2.875rem",
            ],
          },
        ].map((s) => (
          <Card key={s.title} shadow="sm" radius="md" p="md" style={{ border: "none" }}>
            <Group gap={8} mb={12}>
              <ThemeIcon size={28} radius="md" color="indigo" variant="light">
                <s.icon size={16} />
              </ThemeIcon>
              <Text fw={600} size="sm">{s.title}</Text>
            </Group>
            <List
              spacing={4}
              size="xs"
              icon={
                <Box
                  style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: BRAND, marginTop: "0.3125rem" }}
                />
              }
            >
              {s.items.map((item) => (
                <List.Item key={item}>
                  <Text size="xs" c="dimmed">{item}</Text>
                </List.Item>
              ))}
            </List>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
