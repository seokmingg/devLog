export type Tone = 'blue' | 'pink' | 'yellow'

export interface Person {
  initials: string
  name: string
  description: string
  tone: Tone
}

export interface Post {
  id: number
  author: Omit<Person, 'description'>
  createdAt: string
  kind: 'code' | 'diagram'
  likes?: number
  content?: string
  hashtags?: string[]
  comments?: number
}
