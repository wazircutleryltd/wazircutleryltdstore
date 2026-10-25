'use client';

import React from 'react';
import { GoogleReCaptchaProvider as Provider } from 'react-google-recaptcha-v3';

export default function GoogleReCaptchaV3Provider({ children }: { children: React.ReactNode }) {
  const recaptchaV3SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;

  if (!recaptchaV3SiteKey) {
    console.error("NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY is not set. reCAPTCHA v3 will not be available.");
    return <>{children}</>;
  }

  return (
    <Provider reCaptchaKey={recaptchaV3SiteKey}>
      {children}
    </Provider>
  );
}
