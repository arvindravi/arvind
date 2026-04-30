import { useRouter } from 'next/router'
import * as React from 'react'
import slugify from 'slugify'

import { ErrorAlert } from '~/components/Alert'
import Button from '~/components/Button'
import { Input, Textarea } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { GET_PHOTOGRAPHS } from '~/graphql/queries/photographs'
import { useAddPhotographMutation } from '~/graphql/types.generated'

import { PhotographImageUploader } from './PhotographImageUploader'

export function AddPhotographForm({ closeModal }) {
  const [title, setTitle] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [caption, setCaption] = React.useState('')
  const [capturedAt, setCapturedAt] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [camera, setCamera] = React.useState('')
  const [lens, setLens] = React.useState('')
  const [image, setImage] = React.useState<{
    url: string
    width: number
    height: number
  } | null>(null)
  const [error, setError] = React.useState('')

  const router = useRouter()

  const [handleAdd, { loading }] = useAddPhotographMutation({
    onCompleted: ({ addPhotograph }) => {
      closeModal()
      if (addPhotograph?.slug) {
        return router.push(`/photographs/${addPhotograph.slug}`)
      }
    },
    refetchQueries: [{ query: GET_PHOTOGRAPHS }],
    onError({ message }) {
      setError(message.replace('GraphQL error:', ''))
    },
  })

  function onTitleChange(e) {
    error && setError('')
    const value = e.target.value
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value, { lower: true, strict: true }))
  }

  function onSlugChange(e) {
    error && setError('')
    setSlugTouched(true)
    setSlug(e.target.value)
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!image) return setError('Please upload an image')
    if (!title) return setError('Please enter a title')
    if (!slug) return setError('Please enter a slug')

    return handleAdd({
      variables: {
        data: {
          title,
          slug,
          caption: caption || null,
          imageUrl: image.url,
          width: image.width,
          height: image.height,
          capturedAt: capturedAt ? new Date(capturedAt).getTime() : null,
          location: location || null,
          camera: camera || null,
          lens: lens || null,
        },
      },
    })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) return onSubmit(e)
  }

  return (
    <div className="space-y-3 p-4">
      <PhotographImageUploader onImageUploaded={setImage} onError={setError} />
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={onTitleChange}
          onKeyDown={onKeyDown}
        />
        <Input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={onSlugChange}
          onKeyDown={onKeyDown}
        />
        <Textarea
          rows={3}
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          type="date"
          placeholder="Captured at"
          value={capturedAt}
          onChange={(e) => setCapturedAt(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          type="text"
          placeholder="Location (e.g. Reykjavík, Iceland)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          type="text"
          placeholder="Camera"
          value={camera}
          onChange={(e) => setCamera(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          type="text"
          placeholder="Lens"
          value={lens}
          onChange={(e) => setLens(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="flex justify-end">
          <Button disabled={!image || !title || !slug || loading}>
            {loading ? <LoadingSpinner /> : 'Save'}
          </Button>
        </div>
        {error && <ErrorAlert>{error}</ErrorAlert>}
      </form>
    </div>
  )
}
