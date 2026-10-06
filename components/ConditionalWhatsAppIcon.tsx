'use client';

import { usePathname } from 'next/navigation';
import WhatsAppIcon from './WhatsAppIcon';

export default function ConditionalWhatsAppIcon() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return <WhatsAppIcon />;
}
