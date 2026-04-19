import * as React from 'react'

import Button, { DeleteButton } from '~/components/Button'

import { DeleteUserDialog } from './DeleteUserDialog'

export function UserSettingsFooter() {
  return (
    <div className="flex justify-between space-x-4 py-12">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 server-redirect, not a Next page */}
      <a href="/api/auth/logout">
        <Button>Log out</Button>
      </a>
      <DeleteUserDialog trigger={<DeleteButton>Delete account</DeleteButton>} />
    </div>
  )
}
