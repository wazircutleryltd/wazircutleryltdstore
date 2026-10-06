import React from "react";
import type { Metadata } from "next";
import CartClient from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your shopping cart at Wazir Cutlery. " +
      "Check your selected handcrafted knives, swords, and chef cutlery " +
      "before proceeding to our secure checkout. Finalize your order of " +
      "premium Wazirabad-forged blades.",
};

export default function CartPage() {
  return <CartClient />;
}
