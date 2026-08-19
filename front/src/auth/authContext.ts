import {createContext} from 'react'
import type {AuthMemberDto} from '../types/auth.ts'

export interface AuthContextValue {
    member: AuthMemberDto | null
    accessToken: string | null
    authLoading: boolean
    login: (email: string, password: string) => Promise<void>
    restoreSession: () => Promise<boolean>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
