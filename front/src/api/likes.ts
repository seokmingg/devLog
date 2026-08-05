import {apiClient} from './client.ts'

export async function likePost(postId: number): Promise<void> {
    await apiClient.put(`/posts/${postId}/likes`)
}

export async function unlikePost(postId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}/likes`)
}
