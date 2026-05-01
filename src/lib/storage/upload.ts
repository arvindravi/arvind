// Client-side image upload — Vercel Blob implementation.
// To swap providers: replace the body of uploadImage and update
// /api/images/upload.ts to match the new provider's handshake.
import { upload } from '@vercel/blob/client'

export async function uploadImage(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/images/upload',
  })
  return blob.url
}
