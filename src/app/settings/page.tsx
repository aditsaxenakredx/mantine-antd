import AppLayout from "@/components/AppLayout";
import SettingsPage from "@/components/SettingsPage";

export const metadata = { title: "Settings – TaskFlow" };

export default function Page() {
  return (
    <AppLayout>
      <SettingsPage />
    </AppLayout>
  );
}
