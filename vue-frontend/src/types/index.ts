export interface FooterSection {
  title?: string
  links?: {
    text?: string
    href?: string
  }[]
}

export interface TrustFeature {
  icon: any
  title: string
  description: string
}

export interface CarouselItem {
  src: string
}