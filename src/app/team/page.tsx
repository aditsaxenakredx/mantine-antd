import AppLayout from "@/components/AppLayout";
import TeamPage from "@/components/TeamPage";

export const metadata = { title: "Team – TaskFlow" };

export default function Page() {
  return (
    <AppLayout>
      <TeamPage />
    </AppLayout>
  );
}
