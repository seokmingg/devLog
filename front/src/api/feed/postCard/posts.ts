import type {CreatePostRequestDto, PostCursorResponseDto, PostResponseDto} from '../../../types/feed.ts'
import {apiClient} from '../../client.ts'

const DEFAULT_POST_SIZE = 5

export async function getPost(postId: number): Promise<PostResponseDto> {
    const response = await apiClient.get<PostResponseDto>(`/posts/${postId}`)
    return response.data
}

export async function getPosts(
    cursor?: number,
    size = DEFAULT_POST_SIZE,
    tag?: string,
    query?: string,
): Promise<PostCursorResponseDto> {
    const response = await apiClient.get<PostCursorResponseDto>('/posts', {
        params: {cursor, size, tag, q: query},
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

export async function createPost(request: CreatePostRequestDto): Promise<PostResponseDto> {
    const response = await apiClient.post<PostResponseDto>('/posts', request)
    return response.data
}

export async function deletePost(postId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}`)
}

export async function updatePost(
    postId: number,
    request: CreatePostRequestDto,
): Promise<PostResponseDto> {
    const response = await apiClient.put<PostResponseDto>(`/posts/${postId}`, request)
    return response.data
}
