import {Navigate, Outlet} from 'react-router-dom'
import {useAuth} from '../auth/useAuth.ts'
import styles from './RouteGuard.module.css'

export function GuestRoute() {
    const {member, authLoading} = useAuth()

    if (authLoading) {
        return (
            <main className={styles.page}>
                <span className={styles.spinner} aria-hidden="true">◌</span>
                <p>로그인 상태를 확인하는 중...</p>
            </main>
        )
    }

    return member ? <Navigate to="/" replace/> : <Outlet/>
}
