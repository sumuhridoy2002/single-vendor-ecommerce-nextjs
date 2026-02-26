export interface HeroSliderItem {
  id: number
  serial: number
  title: string
  sub_title: string | null
  image: string
  link: string
}

export interface HeroSlidersApiResponse {
  data: HeroSliderItem[]
  status: number
  message: string
}
