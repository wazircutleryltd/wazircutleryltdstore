import React from "react";
import type { Metadata } from "next";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with Wazir Cutlery's secure checkout. " +
      "Enter your shipping and payment details to finalize your purchase of " +
      "our handcrafted knives, swords, and chef cutlery. " +
      "Your premium Wazirabad-forged blades are just a few clicks away.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
