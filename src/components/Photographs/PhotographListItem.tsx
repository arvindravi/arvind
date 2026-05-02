import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { PhotographListItemFragment } from '~/graphql/types.generated'

interface Props {
  photograph: PhotographListItemFragment
  active: boolean
}

export const PhotographListItem = React.memo<Props>(
  ({ photograph, active }) => {
    return (
      <Link
        href="/photographs/[slug]"
        as={`/photographs/${photograph.slug}`}
        className={`relative block aspect-square bg-white p-1.5 shadow-sm transition-shadow hover:shadow-md ${
          active
            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
            : ''
        }`}
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={photograph.imageUrl}
            alt={photograph.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
      </Link>
    )
  }
)
