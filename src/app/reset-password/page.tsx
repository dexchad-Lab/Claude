import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-gray-900">
          Choose a new password
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Make it at least 8 characters.
        </p>

        <ResetPasswordForm token={token ?? ""} />
      </div>
    </div>
  );
}
