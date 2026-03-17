import { treaty } from '@elysiajs/eden'
import type { ApiApp } from '@web-game/api'
import { apiBaseUrl } from './api-base'

export const api = treaty<ApiApp>(apiBaseUrl, {
  fetch(input, init) {
    return fetch(input, {
      ...init,
      credentials: 'include',
    })
  },
})
