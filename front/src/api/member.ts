import type {MyPageResponseDto, UpdateProfileRequestDto} from '../types/member.ts'
import {apiClient} from './client.ts'

export async function getMyPage(): Promise<MyPageResponseDto> {
    const response = await apiClient.get<MyPageResponseDto>('/members/me')
    return response.data
}

export async function updateMyProfile(
    request: UpdateProfileRequestDto,
): Promise<MyPageResponseDto> {
    const response = await apiClient.patch<MyPageResponseDto>('/members/me', request)
    return response.data
}

export async function withdrawMyAccount(): Promise<void> {
    await apiClient.delete('/members/me')
}
