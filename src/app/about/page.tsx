'use client'

import Image from 'next/image'
import Link from 'next/link'
import { about, config } from '@/content'
import EditableText from '@/components/ui/EditableText'

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <EditableText file="about" path="heading" as="h1" className="font-display text-4xl md:text-5xl text-walnut mb-4">
            {about.heading}
          </EditableText>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Family photo */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-border">
              <Image
                src={about.familyPhoto}
                alt={`${config.ownerName} and family`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Story text */}
          <div className="flex-1">
            <div className="space-y-6">
              {about.paragraphs.map((paragraph, i) => (
                <EditableText key={i} file="about" path={`paragraphs.${i}`} as="p" className="text-lg text-muted leading-relaxed" multiline>
                  {paragraph}
                </EditableText>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-walnut font-display text-xl mb-4">
                Want to work together?
              </p>
              <Link
                href="/order/"
                className="inline-block bg-walnut hover:bg-oak text-cream px-8 py-3 rounded font-medium transition-colors"
              >
                Order a Custom Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
