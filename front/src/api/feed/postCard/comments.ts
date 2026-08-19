import type {CommentPageResponseDto, CommentResponseDto} from '../../../types/feed.ts'
import {apiClient} from '../../client.ts'

export async function getPostComments(
    postId: number,
    page: number,
    size = 10,
): Promise<CommentPageResponseDto> {
    const response = await apiClient.get<CommentPageResponseDto>(
        `/posts/${postId}/comments`,
        {
            params: {page, size},
        },
    )

    if (
        !response.data
        || typeof response.data !== 'object'
        || !Array.isArray(response.data.content)
    ) {
        throw new Error('Invalid comments response')
    }

    return response.data
}

export async function createPostComment(
    postId: number,
    contents: string,
): Promise<CommentResponseDto> {
    const response = await apiClient.post<CommentResponseDto>(`/posts/${postId}/comments`, {contents})
    return response.data
}
