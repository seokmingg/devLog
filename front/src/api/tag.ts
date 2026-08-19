import type {TechnologyTagDto} from '../types/tag.ts'
import {apiClient} from './client.ts'

export async function getTechnologyTags(): Promise<TechnologyTagDto[]> {
    const response = await apiClient.get<TechnologyTagDto[]>('/tags')
    return response.data
}
