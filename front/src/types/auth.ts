export interface TokenResponseDto {
    accessToken: string
    tokenType: string
    expiresInSeconds: number
}

export interface AuthMemberDto {
    id: number
    email: string
    nickname: string
    profileImageUrl: string | null
}

export interface SignupRequestDto {
    email: string
    password: string
    nickname: string
}

export interface LoginRequestDto {
    email: string
    password: string
}
