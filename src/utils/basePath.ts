/**
 * Prepends the Next.js basePath to an asset path.
 * Required because next/image with unoptimized:true in static export
 * does not automatically prepend basePath to src attributes.
 *
 * Usage: <Image src={assetPath("/photos/portfolio/sign.jpg")} ... />
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${base}${path}`
}
