import { treaty } from '@elysiajs/eden'
// Import the type from your root server file (adjust the relative path if needed)
import type { App } from '../../../server/src/index.ts'

// Initialize Eden with your server's URL
export const api = treaty<App>('http://localhost:3000')