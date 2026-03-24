import type { NextConfig } from 'next'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const basePath = isGitHubPages ? '/faithful-woodworker' : ''

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
