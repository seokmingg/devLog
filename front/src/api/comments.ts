import type {CommentPageResponseDto} from '../types/feed.ts'
import {apiClient} from './client.ts'

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

    return response.data
}
