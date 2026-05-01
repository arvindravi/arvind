import React from 'react'
import { useDropzone } from 'react-dropzone'

import { uploadImage } from '~/lib/storage/upload'

import { ActiveDropzone } from './ActiveDropzone'

interface DropzoneProps {
  children: React.ReactNode
  onUploadStarted: () => void
  onUploadComplete: (url?: string) => void
  onUploadFailed: () => void
}

export function Dropzone(props: DropzoneProps) {
  const { children, onUploadComplete, onUploadStarted, onUploadFailed } = props

  const onDropAccepted = React.useCallback(async (acceptedFiles: File[]) => {
    onUploadStarted()
    try {
      const url = await uploadImage(acceptedFiles[0])
      onUploadComplete(url)
    } catch (err) {
      console.error('[Dropzone] upload error', err)
      onUploadFailed()
    }
  }, [])

  function onDropRejected() {
    alert('File rejected')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    noKeyboard: true,
    multiple: false,
    noClick: true,
    maxSize: 1000 * 1000 * 3, // 3mb
    accept: { 'image/jpeg': [], 'image/png': [], 'image/gif': [] },
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <ActiveDropzone /> : children}
    </div>
  )
}
