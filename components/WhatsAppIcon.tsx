'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function WhatsAppIcon() {
  return (
    <Link href="https://wa.me/923160764052" target="_blank" rel="noopener noreferrer" className="whatsapp-icon-container" suppressHydrationWarning>
      <div className="whatsapp-text" suppressHydrationWarning>Contact Us on WhatsApp now!</div>
      <div className="whatsapp-icon" suppressHydrationWarning>
        <Image src="/whatsapp.png" alt="WhatsApp" width={48} height={48} loading="eager" />
      </div>
    </Link>
  );
}
