import AppLayout from "@/components/AppLayout";
import TasksPage from "@/components/TasksPage";

export const metadata = { title: "Tasks – TaskFlow" };

export default function Page() {
  return (
    <AppLayout>
      <TasksPage />
    </AppLayout>
  );
}
