import {useCallback, useEffect, useState, type ReactNode} from 'react'
import {logout as requestLogout, restoreAuthSession} from '../api/auth.ts'
import {setAccessToken as applyAccessToken} from '../api/client.ts'
import type {AuthMemberDto} from '../types/auth.ts'
import {AuthContext} from './authContext.ts'

export function AuthProvider({children}: { children: ReactNode }) {
    const [member, setMember] = useState<AuthMemberDto | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [authLoading, setAuthLoading] = useState(true)

    const restoreSession = useCallback(async () => {
        setAuthLoading(true)

        try {
            const restored = await restoreAuthSession()
            setAccessToken(restored.token.accessToken)
            setMember(restored.member)
            return true
        } catch {
            applyAccessToken(null)
            setAccessToken(null)
            setMember(null)
            return false
        } finally {
            setAuthLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        await requestLogout()
        setAccessToken(null)
        setMember(null)
    }, [])

    useEffect(() => {
        let active = true

        restoreAuthSession()
            .then(restored => {
                if (!active) return
                setAccessToken(restored.token.accessToken)
                setMember(restored.member)
            })
            .catch(() => {
                if (!active) return
                applyAccessToken(null)
                setAccessToken(null)
                setMember(null)
            })
            .finally(() => {
                if (active) {
                    setAuthLoading(false)
                }
            })

        return () => {
            active = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            member,
            accessToken,
            authLoading,
            restoreSession,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
