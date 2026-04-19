# Concerns

## Caching Issues (Resolved)
- **Service Worker**: REMOVED. Offline mode was causing aggressive "Cache First" behavior that prevented new changes from reflecting.
- **Unregistration**: Added a proactive script to `layout.tsx` to clear any existing service worker registrations for returning users.

## Next steps
- Monitor Vercel deployments to ensure and confirm that changes are now reflecting.
