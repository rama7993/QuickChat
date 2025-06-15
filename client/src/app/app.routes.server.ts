import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'signup', renderMode: RenderMode.Prerender },
  { path: 'profile', renderMode: RenderMode.Prerender },

  // 👇 Don't prerender chat (SSR instead)
  { path: 'chat', renderMode: RenderMode.Server },

  // 👇 Optional fallback route
  { path: '**', renderMode: RenderMode.Server },
];
