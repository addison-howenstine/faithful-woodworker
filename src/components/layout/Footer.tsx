import Link from 'next/link'
import { config } from '@/content'

export default function Footer() {
  const { socialLinks, tagline } = config

  const hasSocials = socialLinks.instagram || socialLinks.tiktok || socialLinks.facebook

  return (
    <footer className="bg-walnut text-cream">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl mb-2">{config.siteName}</h3>
            <p className="text-cream/70 text-sm italic">{tagline}</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            {hasSocials && (
              <div className="flex gap-6">
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-cream transition-colors text-sm"
                  >
                    Instagram
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-cream transition-colors text-sm"
                  >
                    TikTok
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-cream transition-colors text-sm"
                  >
                    Facebook
                  </a>
                )}
              </div>
            )}

            <div className="flex gap-6 text-sm text-cream/50">
              <Link href="/" className="hover:text-cream transition-colors">Home</Link>
              <Link href="/portfolio/" className="hover:text-cream transition-colors">Portfolio</Link>
              <Link href="/order/" className="hover:text-cream transition-colors">Order</Link>
              <Link href="/about/" className="hover:text-cream transition-colors">About</Link>
            </div>

            <p className="text-cream/40 text-xs">
              &copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
