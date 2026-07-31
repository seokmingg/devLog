export type Tone = 'blue' | 'pink' | 'yellow'

export interface Person {
  initials: string
  name: string
  description: string
  tone: Tone
}

export interface CommentResponseDto {
  id: number
  authorName: string
  contents: string
  createdAt: string
}

export interface CommentPageResponseDto {
  content: CommentResponseDto[]
  number: number
  last: boolean
}

// GET /posts 응답 형식에 맞춰 사용하는 게시글 DTO
export interface PostResponseDto {
  id: number
  title: string
  contents: string
  author: Omit<Person, 'description'>
  createdAt: string
  kind: 'code' | 'diagram'
  likes: number
  hashtags: string[]
  commentCount: number
  isMine?: boolean
}

export type Post = PostResponseDto
