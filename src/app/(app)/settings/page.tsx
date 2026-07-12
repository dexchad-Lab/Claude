import { auth } from "@/auth";
import { SettingsForms } from "@/components/SettingsForms";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
      <SettingsForms
        initialName={session?.user.name ?? ""}
        initialEmail={session?.user.email ?? ""}
      />
    </div>
  );
}
