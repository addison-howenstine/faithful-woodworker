export interface SiteConfig {
  siteName: string
  ownerName: string
  ownerEmail: string
  tagline: string
  domain: string
  socialLinks: {
    instagram: string
    tiktok: string
    facebook: string
  }
  appsScriptUrl: string
}

export interface HomeContent {
  hero: {
    headline: string
    subheadline: string
    ctaPrimary: string
    ctaSecondary: string
    heroImage: string
  }
  storyHighlight: {
    heading: string
    text: string
  }
  progressTracker: {
    enabled: boolean
    label: string
    percentage: number
  }
  ctaSection: {
    heading: string
    buttonText: string
  }
  portfolioPreview: {
    heading: string
    subheading: string
  }
}

export interface AboutContent {
  heading: string
  familyPhoto: string
  paragraphs: string[]
}

export interface PortfolioItem {
  filename: string
  alt: string
  title: string
  category: 'sign' | 'custom' | 'furniture' | 'other'
}

export interface PortfolioContent {
  heading: string
  subheading: string
  items: PortfolioItem[]
}

export interface InstagramPost {
  filename: string
  instagramUrl: string
  caption: string
}

export interface InstagramReel {
  url: string
  caption: string
}

export interface InstagramContent {
  heading: string
  subheading: string
  handle: string
  profileUrl: string
  reels: InstagramReel[]
  posts: InstagramPost[]
}

export interface OrderContent {
  heading: string
  subheading: string
  successMessage: string
  fields: {
    projectTypes: string[]
    styles: string[]
    budgetRanges: string[]
  }
  turnaroundNote: string
}

export interface OrderSubmission {
  name: string
  email: string
  phone: string
  projectType: string
  dimensions: string
  style: string
  colorPreference: string
  budget: string
  description: string
  timestamp: string
}

export interface OrderRecord extends OrderSubmission {
  id: string
  status: 'new' | 'quoted' | 'in_progress' | 'completed' | 'cancelled'
  notes: string
}
