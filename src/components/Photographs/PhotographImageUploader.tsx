import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trash, Upload } from 'react-feather'

import { LoadingSpinner } from '~/components/LoadingSpinner'
import { uploadImage } from '~/lib/storage/upload'

interface UploadedImage {
  url: string
  width: number
  height: number
}

interface Props {
  initial?: UploadedImage | null
  onImageUploaded: (image: UploadedImage | null) => void
  onError?: (message: string) => void
}

function getImageDimensions(file: File): Promise<{
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl)
      reject(err)
    }
    img.src = objectUrl
  })
}

export function PhotographImageUploader({
  initial,
  onImageUploaded,
  onError,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<UploadedImage | null>(initial ?? null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true)
    const file = acceptedFiles[0]

    try {
      let dimensions: { width: number; height: number }
      try {
        dimensions = await getImageDimensions(file)
      } catch {
        onError?.('Could not read image dimensions — try a different file')
        return
      }

      const url = await uploadImage(file)
      const next = { url, width: dimensions.width, height: dimensions.height }
      setPreview(next)
      onImageUploaded(next)
    } catch (err) {
      console.error('[PhotographImageUploader] upload error', err)
      onError?.('Upload failed — ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10 * 1000 * 1000, // 10mb
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: false,
  })

  if (preview) {
    return (
      <div className="relative inline-block h-32 w-32 rounded-lg border border-gray-100 dark:border-gray-900">
        <Image
          src={preview.url}
          width={128}
          height={128}
          alt="Photograph preview"
          quality={100}
          className="inline-block h-32 w-32 rounded-lg object-cover"
        />
        <button
          type="button"
          onClick={() => {
            setPreview(null)
            onImageUploaded(null)
          }}
          className="absolute -top-3 -right-3 cursor-pointer rounded-full border-2 border-white bg-gray-1000 p-2 text-white shadow-md hover:bg-red-500 focus:bg-red-500 dark:border-gray-800 dark:bg-gray-700"
        >
          <Trash size={16} />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className="text-tertiary flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-100 p-6 hover:bg-gray-150 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-800"
    >
      <input {...getInputProps()} />
      {loading ? <LoadingSpinner /> : <Upload size={16} />}
    </div>
  )
}
