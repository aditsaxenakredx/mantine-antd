import AppLayout from "@/components/AppLayout";
import ProjectsPage from "@/components/ProjectsPage";

export const metadata = { title: "Projects – TaskFlow" };

export default function Page() {
  return (
    <AppLayout>
      <ProjectsPage />
    </AppLayout>
  );
}
