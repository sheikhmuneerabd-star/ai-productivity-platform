import { Card } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { DeleteAccountForm } from "@/components/dashboard/delete-account-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Settings</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Settings</h1>
      </div>

      <Card className="p-5">
        <p className="mb-1 text-sm font-medium text-paper-900">Change password</p>
        <p className="mb-4 text-xs text-paper-500">
          Only applies if you signed up with email and password.
        </p>
        <ChangePasswordForm />
      </Card>

      <Card className="border-danger/30 p-5">
        <p className="mb-1 text-sm font-medium text-paper-900">Danger zone</p>
        <p className="mb-4 text-xs text-paper-500">
          Deleting your account is permanent and cannot be undone.
        </p>
        <DeleteAccountForm />
      </Card>
    </div>
  );
}