import { useRouter } from 'next/router'
import * as React from 'react'

import Button, { DeleteButton } from '~/components/Button'
import { Input, Textarea } from '~/components/Input'
import { GET_PHOTOGRAPHS } from '~/graphql/queries/photographs'
import {
  useDeletePhotographMutation,
  useEditPhotographMutation,
} from '~/graphql/types.generated'

function toDateInputValue(date: number | string | null | undefined) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function EditPhotographForm({ closeModal, photograph }) {
  const router = useRouter()

  const [title, setTitle] = React.useState(photograph.title ?? '')
  const [slug, setSlug] = React.useState(photograph.slug ?? '')
  const [caption, setCaption] = React.useState(photograph.caption ?? '')
  const [capturedAt, setCapturedAt] = React.useState(
    toDateInputValue(photograph.capturedAt)
  )
  const [location, setLocation] = React.useState(photograph.location ?? '')
  const [camera, setCamera] = React.useState(photograph.camera ?? '')
  const [lens, setLens] = React.useState(photograph.lens ?? '')
  const [published, setPublished] = React.useState(
    Boolean(photograph.publishedAt)
  )
  const [error, setError] = React.useState('')

  const [editPhotograph] = useEditPhotographMutation()

  const [handleDelete] = useDeletePhotographMutation({
    variables: { id: photograph.id },
    refetchQueries: [{ query: GET_PHOTOGRAPHS }],
    onCompleted() {
      closeModal()
      router.push('/photographs')
    },
  })

  function handleSave(e) {
    e.preventDefault()
    if (!title) return setError('Photograph must have a title')
    if (!slug) return setError('Photograph must have a slug')

    editPhotograph({
      variables: {
        id: photograph.id,
        data: {
          title,
          slug,
          caption: caption || null,
          capturedAt: capturedAt ? new Date(capturedAt).getTime() : null,
          location: location || null,
          camera: camera || null,
          lens: lens || null,
          published,
        },
      },
      onError({ message }) {
        setError(message.replace('GraphQL error:', ''))
      },
    }).then((res) => {
      const nextSlug = res?.data?.editPhotograph?.slug
      closeModal()
      if (nextSlug && nextSlug !== photograph.slug) {
        router.push(`/photographs/${nextSlug}`)
      }
    })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) return handleSave(e)
  }

  return (
    <div className="space-y-3 p-4">
      <form className="space-y-3" onSubmit={handleSave}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Textarea
          rows={3}
          placeholder="Caption"
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
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          placeholder="Camera"
          value={camera}
          onChange={(e) => setCamera(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          placeholder="Lens"
          value={lens}
          onChange={(e) => setLens(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <label className="flex items-center space-x-2 text-sm text-gray-1000 dark:text-white">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published</span>
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-between">
          <DeleteButton
            onClick={() => {
              closeModal()
              handleDelete()
            }}
          >
            Delete
          </DeleteButton>
          <div className="flex space-x-3">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
