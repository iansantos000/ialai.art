import { getSiteSettings } from "@/lib/site-settings";
import { AppearanceForm } from "./appearance-form";

export const metadata = { title: "Aparência" };

export default async function AppearancePage() {
  const settings = await getSiteSettings();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Aparência</h1>
      <AppearanceForm initial={settings} />
    </div>
  );
}
