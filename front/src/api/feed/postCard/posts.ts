import type {PostResponseDto} from '../../../types/feed.ts'
import {apiClient} from '../../client.ts'

export async function getPost(postId: number): Promise<PostResponseDto> {
    const response = await apiClient.get<PostResponseDto>(`/posts/${postId}`)
    return response.data
}
