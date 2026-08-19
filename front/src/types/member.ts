export interface MyPageResponseDto {
    id: number
    email: string
    nickname: string
    profileImageUrl: string | null
    role: 'USER' | 'ADMIN'
    status: 'ACTIVE' | 'WITHDRAWN' | 'SUSPENDED'
    createdAt: string
    loginMethods: Array<'LOCAL' | 'GOOGLE'>
}

export interface UpdateProfileRequestDto {
    nickname: string
}
