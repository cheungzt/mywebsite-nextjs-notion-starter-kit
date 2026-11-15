import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  // Signed Notion file URLs expire even while the generated page is cached.
  // Resolve uploaded images by their permanent attachment ID instead.
  if (url?.startsWith('https://file.notion.com/')) {
    try {
      const fileUrl = new URL(url)
      const parts = fileUrl.pathname.split('/').filter(Boolean)

      if (
        fileUrl.hostname === 'file.notion.com' &&
        parts[0] === 'f' &&
        parts[1] === 'f' &&
        parts.length === 5 &&
        /^[0-9a-f-]{36}$/i.test(parts[3]!)
      ) {
        const filename = decodeURIComponent(parts[4]!)
        url = `attachment:${parts[3]}:${filename}`
      }
    } catch {
      // Preserve the existing mapper's behavior for malformed URLs.
    }
  }

  return defaultMapImageUrl(url, block)
}
