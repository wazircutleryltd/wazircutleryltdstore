'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSettingsStore } from '@/stores/settingsStore';

export default function WhatsAppIcon() {
  const whatsappUrl = useSettingsStore((state) => state.settings.whatsappUrl);
  const internationalPhone = useSettingsStore((state) => state.settings.storeInternationalPhone);

  const cleanPhone = (internationalPhone || "+92 316 0764052").replace(/[^0-9]/g, '');
  const targetUrl = whatsappUrl?.trim() || `https://wa.me/${cleanPhone}`;

  return (
    <Link href={targetUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-icon-container" suppressHydrationWarning>
      <div className="whatsapp-text" suppressHydrationWarning>Contact Us on WhatsApp now!</div>
      <div className="whatsapp-icon" suppressHydrationWarning>
        <Image src="/whatsapp.png" alt="WhatsApp" width={48} height={48} loading="eager" />
      </div>
    </Link>
  );
}
