'use client'

import Image from 'next/image'
import Link from 'next/link'
import { home, portfolio, config } from '@/content'
import { assetPath } from '@/utils/basePath'
import EditableText from '@/components/ui/EditableText'
import ProgressTracker from '@/components/ui/ProgressTracker'
import InstagramSection from '@/components/ui/InstagramSection'

export default function HomePage() {
  // Show first 6 portfolio items as preview
  const previewItems = portfolio.items.slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-walnut text-cream overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src={assetPath(home.hero.heroImage)}
            alt="The Howenstine Family"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-walnut/60 via-walnut/40 to-walnut/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          <EditableText file="config" path="siteName" as="p" className="font-display text-2xl md:text-3xl lg:text-4xl mb-4 tracking-wide text-accent-light uppercase">
            {config.siteName}
          </EditableText>
          <EditableText file="home" path="hero.headline" as="h1" className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            {home.hero.headline}
          </EditableText>
          <EditableText file="home" path="hero.subheadline" as="p" className="text-lg md:text-xl text-cream/80 mb-10 max-w-2xl mx-auto">
            {home.hero.subheadline}
          </EditableText>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order/"
              className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded text-lg font-medium transition-colors"
            >
              <EditableText file="home" path="hero.ctaPrimary">
                {home.hero.ctaPrimary}
              </EditableText>
            </Link>
            <Link
              href="/portfolio/"
              className="border-2 border-cream/50 hover:border-cream text-cream px-8 py-3 rounded text-lg transition-colors"
            >
              <EditableText file="home" path="hero.ctaSecondary">
                {home.hero.ctaSecondary}
              </EditableText>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Story Highlight + Progress Tracker */}
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <EditableText file="home" path="storyHighlight.heading" as="h2" className="font-display text-3xl md:text-4xl text-walnut mb-6">
            {home.storyHighlight.heading}
          </EditableText>
          <EditableText file="home" path="storyHighlight.text" as="p" className="text-muted text-lg leading-relaxed mb-8" multiline>
            {home.storyHighlight.text}
          </EditableText>
          {home.progressTracker.enabled && (
            <ProgressTracker
              label={home.progressTracker.label}
              percentage={home.progressTracker.percentage}
            />
          )}
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <EditableText file="home" path="portfolioPreview.heading" as="h2" className="font-display text-3xl md:text-4xl text-walnut mb-3">
              {home.portfolioPreview.heading}
            </EditableText>
            <EditableText file="home" path="portfolioPreview.subheading" as="p" className="text-muted text-lg">
              {home.portfolioPreview.subheading}
            </EditableText>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewItems.map((item, i) => (
              <Link
                key={i}
                href="/portfolio/"
                className="group relative aspect-square overflow-hidden rounded-lg bg-border"
              >
                <Image
                  src={assetPath(`/photos/portfolio/${item.filename}`)}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <EditableText file="portfolio" path={`items.${i}.title`} as="p" className="text-white font-medium">
                      {item.title}
                    </EditableText>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/portfolio/"
              className="text-walnut hover:text-oak font-medium border-b-2 border-walnut/30 hover:border-walnut transition-colors pb-1"
            >
              View All Projects &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <InstagramSection />

      {/* CTA Section */}
      <section className="py-20 bg-walnut text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <EditableText file="home" path="ctaSection.heading" as="h2" className="font-display text-3xl md:text-5xl mb-8">
            {home.ctaSection.heading}
          </EditableText>
          <Link
            href="/order/"
            className="inline-block bg-accent hover:bg-accent-light text-white px-10 py-4 rounded text-lg font-medium transition-colors"
          >
            <EditableText file="home" path="ctaSection.buttonText">
              {home.ctaSection.buttonText}
            </EditableText>
          </Link>
        </div>
      </section>
    </>
  )
}
