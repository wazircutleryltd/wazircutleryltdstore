import React from "react";
import type { Metadata } from "next";
import PaymentClient from "@/components/PaymentClient";

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete your purchase with Wazir Cutlery's secure payment options.",
};

export default function PaymentPage() {
  return <PaymentClient />;
}
