'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { portfolio } from '@/content'

const breakpointColumns = {
  default: 3,
  1024: 2,
  640: 1,
}

export default function PortfolioPage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...new Set(portfolio.items.map((item) => item.category))]
  const filteredItems =
    filter === 'all'
      ? portfolio.items
      : portfolio.items.filter((item) => item.category === filter)

  const lightboxSlides = filteredItems.map((item) => ({
    src: `/photos/portfolio/${item.filename}`,
    alt: item.alt,
    title: item.title,
  }))

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-walnut mb-4">
            {portfolio.heading}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {portfolio.subheading}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                filter === cat
                  ? 'bg-walnut text-cream'
                  : 'bg-border text-muted hover:bg-walnut/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          {filteredItems.map((item, i) => (
            <div
              key={item.filename}
              className="mb-6 cursor-pointer group"
              onClick={() => setLightboxIndex(i)}
            >
              <div className="relative overflow-hidden rounded-lg bg-border">
                <Image
                  src={`/photos/portfolio/${item.filename}`}
                  alt={item.alt}
                  width={600}
                  height={600}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium text-sm">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>

        {/* Lightbox */}
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={lightboxSlides}
        />

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted mb-4">Like what you see?</p>
          <Link
            href="/order/"
            className="inline-block bg-walnut hover:bg-oak text-cream px-8 py-3 rounded text-lg font-medium transition-colors"
          >
            Order a Custom Project
          </Link>
        </div>
      </div>
    </div>
  )
}
