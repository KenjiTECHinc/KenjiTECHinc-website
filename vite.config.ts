import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'html-transform-guard',
      enforce: 'pre',
      transform(code, id) {
        const filename = id.split('?')[0]
        if (id.includes('html-proxy') || !filename.endsWith('.html')) return
        return { code: 'export {}', map: null }
      },
    },
    { enforce: 'pre', ...mdx({ include: /\.mdx$/ }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss()
  ],
})
