"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Box,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Select,
  Badge,
  Avatar,
  Card,
  Alert,
} from "@mantine/core";
import {
  IconEdit,
  IconDeviceFloppy,
  IconX,
  IconSearch,
  IconFilter,
  IconPlus,
  IconPencil,
} from "@tabler/icons-react";
import { DataTable } from "./DataTable";

const BRAND = "#6366f1";
const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "Operations"];
const STATUSES = ["Active", "On Leave", "Inactive"];
const statusColor: Record<string, string> = { Active: "teal", "On Leave": "yellow", Inactive: "red" };

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  location: string;
  joined: string;
}

const initialData: Employee[] = [
  { id: "1",  name: "Alice Chen",   email: "alice@taskflow.io",  role: "Lead",            department: "Engineering", status: "Active",   location: "San Francisco", joined: "Jan 2022" },
  { id: "2",  name: "Bob Martinez", email: "bob@taskflow.io",    role: "Senior Engineer", department: "Engineering", status: "Active",   location: "New York",      joined: "Mar 2021" },
  { id: "3",  name: "Carol Singh",  email: "carol@taskflow.io",  role: "Designer",        department: "Design",      status: "Active",   location: "Austin",        joined: "Jun 2022" },
  { id: "4",  name: "Dave Park",    email: "dave@taskflow.io",   role: "Engineer",        department: "Engineering", status: "On Leave", location: "Seattle",       joined: "Sep 2022" },
  { id: "5",  name: "Eve Johnson",  email: "eve@taskflow.io",    role: "Manager",         department: "Product",     status: "Active",   location: "Chicago",       joined: "Feb 2020" },
  { id: "6",  name: "Frank Lee",    email: "frank@taskflow.io",  role: "Analyst",         department: "Marketing",   status: "Active",   location: "Boston",        joined: "Nov 2021" },
  { id: "7",  name: "Grace Kim",    email: "grace@taskflow.io",  role: "Director",        department: "Sales",       status: "Active",   location: "Miami",         joined: "Apr 2019" },
  { id: "8",  name: "Henry Brown",  email: "henry@taskflow.io",  role: "Engineer",        department: "Operations",  status: "Inactive", location: "Denver",        joined: "Jul 2023" },
  { id: "9",  name: "Iris Wang",    email: "iris@taskflow.io",   role: "Senior Engineer", department: "Engineering", status: "Active",   location: "Portland",      joined: "Aug 2021" },
  { id: "10", name: "Jack Taylor",  email: "jack@taskflow.io",   role: "Designer",        department: "Design",      status: "Active",   location: "Los Angeles",   joined: "Jan 2023" },
];

/* ─── Isolated cell components ──────────────────────────────────────────────
   Each component owns its own input state. Parent edits map is only updated
   on blur/change, so typing never triggers a parent re-render and focus is
   never lost.
────────────────────────────────────────────────────────────────────────────── */

interface CellSaveHandler {
  onSave: (id: string, field: keyof Employee, value: string) => void;
}

function EditText({
  id, field, initialValue, onSave,
}: { id: string; field: keyof Employee; initialValue: string } & CellSaveHandler) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { setValue(initialValue); }, [initialValue]);

  return (
    <TextInput
      size="xs"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onSave(id, field, value)}
      styles={{
        input: {
          border: "none",
          background: "transparent",
          fontWeight: field === "name" ? 600 : 400,
          padding: "0 0.25rem",
          height: "2rem",
        },
      }}
    />
  );
}

function EditSelect({
  id, field, initialValue, options, onSave,
}: { id: string; field: keyof Employee; initialValue: string; options: string[] } & CellSaveHandler) {
  return (
    <Select
      size="xs"
      defaultValue={initialValue}
      onChange={(v) => v && onSave(id, field, v)}
      data={options}
      styles={{
        input: { border: "none", background: "transparent", padding: "0 0.25rem", height: "2rem" },
      }}
    />
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */

const helper = createColumnHelper<Employee>();

export default function EditableTablePage() {
  const [rowData, setRowData] = useState<Employee[]>(initialData);
  const [pendingEdits, setPendingEdits] = useState<Map<string, Partial<Employee>>>(new Map());
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rowData.filter((r) => {
        const matchSearch =
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase());
        const matchDept = !deptFilter || r.department === deptFilter;
        const matchStatus = !statusFilter || r.status === statusFilter;
        return matchSearch && matchDept && matchStatus;
      }),
    [rowData, search, deptFilter, statusFilter],
  );

  // Stable save handler — does not recreate on every edits change
  const handleCellSave = useCallback((id: string, field: keyof Employee, value: string) => {
    setPendingEdits((prev) => {
      const next = new Map(prev);
      next.set(id, { ...next.get(id), [field]: value });
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    setRowData((prev) =>
      prev.map((r) => {
        const delta = pendingEdits.get(r.id);
        return delta ? { ...r, ...delta } : r;
      }),
    );
    setPendingEdits(new Map());
    setEditMode(false);
  }, [pendingEdits]);

  const handleCancel = useCallback(() => {
    setPendingEdits(new Map());
    setEditMode(false);
  }, []);

  // columns only depend on editMode and handleCellSave — both stable during typing
  const columns = useMemo(
    () => [
      helper.accessor("name", {
        id: "name",
        header: "Name",
        size: 220,
        cell: (info) => {
          const row = info.row.original;
          if (editMode) {
            return <EditText id={row.id} field="name" initialValue={row.name} onSave={handleCellSave} />;
          }
          return (
            <Group gap={8} wrap="nowrap">
              <Avatar size={26} style={{ background: BRAND, fontSize: "0.625rem", flexShrink: 0 }} radius="xl">
                {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </Avatar>
              <Text fw={600} size="sm" lineClamp={1}>{info.getValue()}</Text>
            </Group>
          );
        },
      }),
      helper.accessor("email", {
        header: "Email",
        size: 220,
        cell: (info) => {
          const row = info.row.original;
          if (editMode) return <EditText id={row.id} field="email" initialValue={row.email} onSave={handleCellSave} />;
          return <Text size="sm" c="dimmed" lineClamp={1}>{info.getValue()}</Text>;
        },
      }),
      helper.accessor("role", {
        header: "Role",
        size: 160,
        cell: (info) => {
          const row = info.row.original;
          if (editMode) return <EditText id={row.id} field="role" initialValue={row.role} onSave={handleCellSave} />;
          return <Text size="sm">{info.getValue()}</Text>;
        },
      }),
      helper.accessor("department", {
        header: "Department",
        size: 160,
        cell: (info) => {
          const row = info.row.original;
          if (editMode) {
            return (
              <EditSelect
                id={row.id}
                field="department"
                initialValue={row.department}
                options={DEPARTMENTS}
                onSave={handleCellSave}
              />
            );
          }
          return <Badge color="indigo" variant="light" size="sm">{info.getValue()}</Badge>;
        },
      }),
      helper.accessor("status", {
        header: "Status",
        size: 130,
        cell: (info) => {
          const row = info.row.original;
          if (editMode) {
            return (
              <EditSelect
                id={row.id}
                field="status"
                initialValue={row.status}
                options={STATUSES}
                onSave={handleCellSave}
              />
            );
          }
          return (
            <Badge color={statusColor[info.getValue()]} variant="dot" size="sm">
              {info.getValue()}
            </Badge>
          );
        },
      }),
      helper.accessor("location", {
        header: "Location",
        size: 150,
        cell: (info) => {
          const row = info.row.original;
          if (editMode) return <EditText id={row.id} field="location" initialValue={row.location} onSave={handleCellSave} />;
          return <Text size="sm" c="dimmed">{info.getValue()}</Text>;
        },
      }),
      helper.accessor("joined", {
        id: "joined",
        header: "Joined",
        size: 110,
        cell: (info) => <Text size="xs" c="dimmed">{info.getValue()}</Text>,
      }),
    ],
    [helper, editMode, handleCellSave],
  );

  return (
    <Box p={{ base: "md", sm: "xl" }}>
      <Group justify="space-between" align="flex-start" mb={24}>
        <Box>
          <Title order={3} style={{ margin: 0 }}>Team Directory</Title>
          <Text c="dimmed" size="sm">{filtered.length} members</Text>
        </Box>
        <Group gap={8}>
          <Button leftSection={<IconPlus size={16} />} color="indigo">Add Member</Button>
          {editMode ? (
            <>
              <Button leftSection={<IconDeviceFloppy size={16} />} color="indigo" onClick={handleSave}>Save Changes</Button>
              <Button leftSection={<IconX size={16} />} variant="default" onClick={handleCancel}>Cancel</Button>
            </>
          ) : (
            <Button leftSection={<IconEdit size={16} />} variant="default" onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </Group>
      </Group>

      <Card shadow="sm" radius="md" p={0} style={{ border: "none", overflow: "hidden" }}>
        <Group p={16} pb={0} gap="sm" wrap="wrap">
          <TextInput
            placeholder="Search by name or email..."
            leftSection={<IconSearch size={16} color="#94a3b8" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 auto", minWidth: "9rem", maxWidth: "16.25rem" }}
          />
          <Select
            placeholder="All Departments"
            clearable
            value={deptFilter}
            onChange={setDeptFilter}
            data={DEPARTMENTS}
            style={{ width: "10.625rem" }}
            leftSection={<IconFilter size={14} color="#94a3b8" />}
          />
          <Select
            placeholder="All Statuses"
            clearable
            value={statusFilter}
            onChange={setStatusFilter}
            data={STATUSES}
            style={{ width: "8.75rem" }}
          />
        </Group>

        {editMode && (
          <Alert icon={<IconPencil size={16} />} color="yellow" variant="light" m={16} mb={0} radius="md">
            Edit mode active — click any cell to edit. Changes are saved when you click Save Changes.
          </Alert>
        )}

        <Box mt={12}>
          <DataTable
            data={filtered}
            columns={columns}
            pinnedLeft={["name"]}
            pinnedRight={["joined"]}
            pagination
            pageSize={8}
            rowHeight={editMode ? "3rem" : "3.375rem"}
          />
        </Box>
      </Card>
    </Box>
  );
}
