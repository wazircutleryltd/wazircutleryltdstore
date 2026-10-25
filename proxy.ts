import { type NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

const clerkHandler = clerkMiddleware();

export function proxy(request: NextRequest, event: any) {
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for Next internals and static assets
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
