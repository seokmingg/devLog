import type {PostCursorResponseDto, PostResponseDto} from '../../../types/feed.ts'
import {apiClient} from '../../client.ts'

const DEFAULT_POST_SIZE = 5

export async function getPost(postId: number): Promise<PostResponseDto> {
    const response = await apiClient.get<PostResponseDto>(`/posts/${postId}`)
    return response.data
}

export async function getPosts(
    cursor?: number,
    size = DEFAULT_POST_SIZE,
): Promise<PostCursorResponseDto> {
    const response = await apiClient.get<PostCursorResponseDto>('/posts', {
        params: {cursor, size},
    })

    const data = response.data

    if (
        !data
        || typeof data !== 'object'
        || !Array.isArray(data.content)
    ) {
        throw new Error('Invalid posts response')
    }

    return data
}
