import { format } from 'date-fns'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Tags } from '~/components/Tag'
import routes from '~/config/routes'
import { useGetPhotographQuery } from '~/graphql/types.generated'

import { PhotographActions } from './PhotographActions'

function formatCaptured(value: number | string | null | undefined) {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return format(d, 'MMMM d, yyyy')
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex space-x-2 text-sm text-gray-1000 text-opacity-60 dark:text-white dark:text-opacity-40">
      <dt className="font-medium">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export function PhotographDetail({ slug }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const { data, loading, error } = useGetPhotographQuery({
    variables: { slug },
  })

  if (loading) return <Detail.Loading />
  if (!data?.photograph || error) return <Detail.Null />

  const { photograph } = data
  const cameraLens = [photograph.camera, photograph.lens]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <NextSeo
        title={photograph.title}
        description={photograph.caption ?? routes.photographs.seo.description}
        openGraph={{
          title: photograph.title,
          description: photograph.caption ?? routes.photographs.seo.description,
          images: [
            {
              url: photograph.imageUrl,
              alt: photograph.title,
            },
          ],
        }}
      />
      <Detail.Container data-cy="photograph-detail" ref={scrollContainerRef}>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/photographs'}
          magicTitle
          title={photograph.title}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
          trailingAccessory={<PhotographActions photograph={photograph} />}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
              <Image
                priority
                src={photograph.imageUrl}
                width={photograph.width}
                height={photograph.height}
                alt={photograph.title}
                sizes="(max-width: 768px) 100vw, 768px"
                className="h-auto w-full"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Detail.Title ref={titleRef}>{photograph.title}</Detail.Title>
              {photograph.tags && photograph.tags.length > 0 && (
                <Tags tags={photograph.tags} />
              )}
            </div>

            {photograph.caption && (
              <p className="text-primary text-base leading-relaxed">
                {photograph.caption}
              </p>
            )}

            <dl className="space-y-1">
              <MetaRow
                label="Captured"
                value={formatCaptured(photograph.capturedAt)}
              />
              <MetaRow label="Location" value={photograph.location} />
              <MetaRow label="Camera" value={cameraLens || null} />
            </dl>
          </Detail.Header>
        </Detail.ContentContainer>
      </Detail.Container>
    </>
  )
}
