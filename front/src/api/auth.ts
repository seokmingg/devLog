import type {AuthMemberDto, LoginRequestDto, SignupRequestDto, TokenResponseDto} from '../types/auth.ts'
import {apiClient, setAccessToken} from './client.ts'

interface RestoredSession {
    token: TokenResponseDto
    member: AuthMemberDto
}

let sessionRestorePromise: Promise<RestoredSession> | null = null

export async function signup(request: SignupRequestDto): Promise<AuthMemberDto> {
    const response = await apiClient.post<AuthMemberDto>('/auth/signup', request)
    return response.data
}

export async function login(request: LoginRequestDto): Promise<RestoredSession> {
    const tokenResponse = await apiClient.post<TokenResponseDto>('/auth/login', request)
    const token = tokenResponse.data
    setAccessToken(token.accessToken)

    try {
        const memberResponse = await apiClient.get<AuthMemberDto>('/auth/me')
        return {token, member: memberResponse.data}
    } catch (error) {
        setAccessToken(null)

        throw error
    }
}

export async function restoreAuthSession(): Promise<RestoredSession> {
    if (!sessionRestorePromise) {
        sessionRestorePromise = restoreSession().finally(() => {
            sessionRestorePromise = null
        })
    }

    return sessionRestorePromise
}

async function restoreSession(): Promise<RestoredSession> {
    const tokenResponse = await apiClient.post<TokenResponseDto>('/auth/refresh')
    const token = tokenResponse.data
    setAccessToken(token.accessToken)

    try {
        const memberResponse = await apiClient.get<AuthMemberDto>('/auth/me')
        return {token, member: memberResponse.data}
    } catch (error) {
        setAccessToken(null)
        throw error
    }
}

export async function logout(): Promise<void> {
    try {
        await apiClient.post('/auth/logout')
    } finally {
        setAccessToken(null)
    }
}
