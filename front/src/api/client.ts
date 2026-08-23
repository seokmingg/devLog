import axios from 'axios'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 10_000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

export function setAccessToken(accessToken: string | null) {
    if (accessToken) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        return
    }

    delete apiClient.defaults.headers.common.Authorization
}
