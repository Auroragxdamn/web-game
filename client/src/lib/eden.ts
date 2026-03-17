import { treaty } from '@elysiajs/eden'
import type { ApiApp } from '@web-game/api'

const defaultApiUrl =
  typeof window === 'undefined'
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}:3000`

const URL = import.meta.env.VITE_API_URL || defaultApiUrl
export const api = treaty<ApiApp>(URL)
