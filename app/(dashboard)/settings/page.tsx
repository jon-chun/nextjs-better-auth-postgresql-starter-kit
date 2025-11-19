"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Upload } from "lucide-react";
import { mockUser } from "@/lib/mock-data";
import { PLUSHIE_STYLES } from "@/lib/constants";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [defaultStyle, setDefaultStyle] = useState<string>(
    PLUSHIE_STYLES[0].id
  );

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSave = () => {
    alert("Settings saved! (Mock action)");
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deletion requested (Mock action)");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      {/* Profile Section */}
      <Card className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Profile</h2>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={mockUser.name} />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={mockUser.email} disabled />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email address
            </p>
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Preferences</h2>
        <div className="space-y-6">
          {/* Default Style */}
          <div className="space-y-2">
            <Label htmlFor="defaultStyle">Default Plushie Style</Label>
            <Select value={defaultStyle} onValueChange={setDefaultStyle}>
              <SelectTrigger id="defaultStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLUSHIE_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.emoji} {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This style will be pre-selected when generating new plushies
            </p>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive emails about new features and updates
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </div>
      </Card>

      {/* Account Section */}
      <Card className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Account</h2>
        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Last changed 30 days ago
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          {/* Delete Account */}
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Danger Zone</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. All your
                  data, including generated images, will be permanently deleted.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
