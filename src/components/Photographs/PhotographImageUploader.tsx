import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trash, Upload } from 'react-feather'

import { LoadingSpinner } from '~/components/LoadingSpinner'
import { CLOUDFLARE_IMAGE_DELIVERY_BASE_URL } from '~/lib/cloudflare'

interface UploadedImage {
  url: string
  width: number
  height: number
}

interface Props {
  initial?: UploadedImage | null
  onImageUploaded: (image: UploadedImage | null) => void
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

export function PhotographImageUploader({ initial, onImageUploaded }: Props) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<UploadedImage | null>(initial ?? null)

  async function getSignedUrl() {
    const data = await fetch('/api/images/sign').then((res) => res.json())
    return data?.uploadURL
  }

  async function uploadFile({ file, signedUrl }) {
    const data = new FormData()
    data.append('file', file)
    const upload = await fetch(signedUrl, {
      method: 'POST',
      body: data,
    }).then((r) => r.json())
    return upload?.result?.id
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true)
    const file = acceptedFiles[0]

    let dimensions: { width: number; height: number }
    try {
      dimensions = await getImageDimensions(file)
    } catch (err) {
      console.error({ err })
      setLoading(false)
      return
    }

    const signedUrl = await getSignedUrl()
    if (!signedUrl) {
      setLoading(false)
      return console.error('No signed url')
    }

    const id = await uploadFile({ file, signedUrl })
    if (!id) {
      setLoading(false)
      return console.error('Upload failed')
    }

    const url = `${CLOUDFLARE_IMAGE_DELIVERY_BASE_URL}/${id}/public`
    const next = { url, width: dimensions.width, height: dimensions.height }
    setLoading(false)
    setPreview(next)
    return onImageUploaded(next)
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
