import React from "react";
import type { Metadata } from "next";
import SettingsClient from "@/components/admin/SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure administrative and store settings for Wazir Cutlery.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
