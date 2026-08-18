"use client";

import * as React from "react";
import { Shield, Key, Bell, User } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useAppSelector } from "@/store/hooks";

function ProfileConfigCard({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}): React.JSX.Element {
  return (
    <Card className="lg:col-span-2 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-app-border/40 pb-4">
        <User className="w-5 h-5 text-app-brand" />
        <Heading level={3} size="md">
          Profile Configuration
        </Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" defaultValue={name} />
        <Input label="Email Address" defaultValue={email} />
      </div>

      <div className="flex items-center justify-between border-t border-app-border/40 pt-4">
        <Badge variant="emerald" className="gap-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Role: {role}</span>
        </Badge>
        <Button variant="primary" size="sm">
          Save Profile Changes
        </Button>
      </div>
    </Card>
  );
}

function SecuritySettingsSection(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-app-fg">
          <Key className="w-4 h-4 text-app-brand" />
          <h4 className="font-bold text-sm">Security Standards</h4>
        </div>
        <p className="text-xs text-app-muted">
          Hardware key 2FA & encrypted data storage enabled.
        </p>
        <Button variant="outline" size="sm" className="w-full">
          Update Password
        </Button>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-app-fg">
          <Bell className="w-4 h-4 text-sky-500" />
          <h4 className="font-bold text-sm">Notifications</h4>
        </div>
        <p className="text-xs text-app-muted">
          Instant alerts for high-value VIP curation requests.
        </p>
        <Button variant="secondary" size="sm" className="w-full">
          Manage Preferences
        </Button>
      </Card>
    </div>
  );
}

export default function SettingsPage(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  const name = user ? user.name : "Admin User";
  const email = user ? user.email : "admin@example.com";
  const role = user ? user.role : "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={1} size="xl">
          Workspace Settings
        </Heading>
        <p className="text-app-muted text-xs font-medium mt-1">
          Configure profile details, security protocols, and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileConfigCard name={name} email={email} role={role} />
        <SecuritySettingsSection />
      </div>
    </div>
  );
}
