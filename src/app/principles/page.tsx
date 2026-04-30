import AppLayout from "@/components/AppLayout";
import PrinciplesPage from "@/components/PrinciplesPage";

export const metadata = { title: "Design Principles – TaskFlow" };

export default function Page() {
  return (
    <AppLayout>
      <PrinciplesPage />
    </AppLayout>
  );
}
