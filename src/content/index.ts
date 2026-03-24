import type { SiteConfig, HomeContent, AboutContent, PortfolioContent, OrderContent } from '@/types'
import configData from './config.json'
import homeData from './home.json'
import aboutData from './about.json'
import portfolioData from './portfolio.json'
import orderData from './order.json'

export const config = configData as SiteConfig
export const home = homeData as HomeContent
export const about = aboutData as AboutContent
export const portfolio = portfolioData as PortfolioContent
export const order = orderData as OrderContent
