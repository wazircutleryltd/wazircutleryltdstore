'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSettingsStore } from '@/stores/settingsStore';

export default function WhatsAppIcon() {
  const whatsappUrl = useSettingsStore((state) => state.settings.whatsappUrl);
  const qamarPhone = useSettingsStore((state) => state.settings.storeWhatsapp);

  const cleanPhone = (qamarPhone || "+92 312 6209302").replace(/[^0-9]/g, '');
  const targetUrl = whatsappUrl?.trim() || `https://wa.me/${cleanPhone}`;

  return (
    <Link href={targetUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-icon-container" suppressHydrationWarning>
      <div className="whatsapp-text" suppressHydrationWarning>Chat with Qamar Mughal on WhatsApp!</div>
      <div className="whatsapp-icon" suppressHydrationWarning>
        <Image src="/whatsapp.png" alt="WhatsApp" width={48} height={48} loading="eager" />
      </div>
    </Link>
  );
}
