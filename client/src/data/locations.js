import frontImg from '../assets/panorama_front.jpg'
import porchImg from '../assets/panorama_porch.jpg'
import roadImg from '../assets/panorama_road.jpg'

export const locations = [
  {
    id: 'road',
    image: roadImg,
    links: {
      forward: 'front',
      back: null,
      left: null,
      right: null
    }
  },
  {
    id: 'front',
    image: frontImg,
    links: {
      forward: 'porch',
      back: 'road',
      left: null,
      right: null
    }
  },
  {
    id: 'porch',
    image: porchImg,
    links: {
      forward: null,
      back: 'front',
      left: null,
      right: null
    }
  }
]
