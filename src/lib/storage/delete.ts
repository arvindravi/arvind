// Server-side image deletion — Vercel Blob implementation.
// To swap providers: replace the body of deleteImage.
// Images stored under a different provider (e.g. old Cloudflare URLs)
// are silently skipped rather than erroring.
import { del } from '@vercel/blob'

export async function deleteImage(url: string): Promise<void> {
  if (!url.includes('vercel-storage.com')) return
  await del(url)
}
