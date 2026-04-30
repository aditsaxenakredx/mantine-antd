import AppLayout from "@/components/AppLayout";
import EditableTablePage from "@/components/EditableTablePage";

export const metadata = { title: "Data Table – TaskFlow" };

export default function Page() {
  return (
    <AppLayout>
      <EditableTablePage />
    </AppLayout>
  );
}
