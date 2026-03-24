'use client'

import Image from 'next/image'
import { instagram } from '@/content'
import { assetPath } from '@/utils/basePath'
import EditableText from '@/components/ui/EditableText'

export default function InstagramSection() {
  const hasReels = instagram.reels.some((r) => r.url)
  const hasPosts = instagram.posts.length > 0

  if (!hasReels && !hasPosts) return null

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-4">
          <EditableText file="instagram" path="heading" as="h2" className="font-display text-3xl md:text-4xl text-walnut mb-3">
            {instagram.heading}
          </EditableText>
          <EditableText file="instagram" path="subheading" as="p" className="text-muted text-lg mb-2">
            {instagram.subheading}
          </EditableText>
          <a
            href={instagram.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-walnut hover:text-oak font-medium transition-colors"
          >
            <InstagramIcon />
            <span>{instagram.handle}</span>
          </a>
        </div>

        {/* Reels */}
        {hasReels && (
          <div className="mt-10">
            <h3 className="font-display text-xl text-walnut mb-6 text-center">Reels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {instagram.reels
                .filter((r) => r.url)
                .map((reel, i) => (
                  <div key={i} className="w-full max-w-[340px]">
                    <iframe
                      src={getReelEmbedUrl(reel.url)}
                      className="w-full aspect-[9/16] max-h-[500px] rounded-lg border border-border"
                      allowFullScreen
                      loading="lazy"
                      title={reel.caption || `Reel ${i + 1}`}
                    />
                    {reel.caption && (
                      <EditableText file="instagram" path={`reels.${i}.caption`} as="p" className="text-sm text-muted mt-2 text-center">
                        {reel.caption}
                      </EditableText>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Post Grid */}
        {hasPosts && (
          <div className="mt-10">
            <h3 className="font-display text-xl text-walnut mb-6 text-center">Latest Work</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {instagram.posts.map((post, i) => {
                const Wrapper = post.instagramUrl ? 'a' : 'div'
                const wrapperProps = post.instagramUrl
                  ? { href: post.instagramUrl, target: '_blank' as const, rel: 'noopener noreferrer' }
                  : {}

                return (
                  <Wrapper
                    key={i}
                    {...wrapperProps}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-border"
                  >
                    <Image
                      src={assetPath(`/photos/portfolio/${post.filename}`)}
                      alt={post.caption}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                        <InstagramIcon className="w-4 h-4 text-white" />
                        <EditableText file="instagram" path={`posts.${i}.caption`} as="p" className="text-white text-sm truncate">
                          {post.caption}
                        </EditableText>
                      </div>
                    </div>
                  </Wrapper>
                )
              })}
            </div>
          </div>
        )}

        {/* Follow CTA */}
        <div className="text-center mt-10">
          <a
            href={instagram.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-walnut hover:bg-oak text-cream px-8 py-3 rounded text-lg font-medium transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
            Follow {instagram.handle}
          </a>
        </div>
      </div>
    </section>
  )
}

/** Convert an Instagram reel URL to its embed URL */
function getReelEmbedUrl(url: string): string {
  // Handle both instagram.com/reel/XXX and instagram.com/p/XXX formats
  const cleanUrl = url.replace(/\/$/, '')
  return `${cleanUrl}/embed`
}

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}
