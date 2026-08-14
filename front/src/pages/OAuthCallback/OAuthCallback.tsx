import {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../auth/useAuth.ts'
import styles from './OAuthCallback.module.css'

export function OAuthCallback() {
    const navigate = useNavigate()
    const {member, authLoading} = useAuth()

    useEffect(() => {
        if (!authLoading && member) {
            navigate('/', {replace: true})
        }
    }, [authLoading, member, navigate])

    if (authLoading || member) {
        return (
            <main className={styles.page}>
                <section className={styles.card}>
                    <span className={styles.spinner} aria-hidden="true">◌</span>
                    <h1>Google 로그인을 완료하는 중...</h1>
                    <p>잠시만 기다려 주세요.</p>
                </section>
            </main>
        )
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <h1>로그인을 완료하지 못했습니다.</h1>
                <p>로그인 정보가 만료되었거나 처리 중 문제가 발생했습니다.</p>
                <Link to="/login">로그인 페이지로 돌아가기</Link>
            </section>
        </main>
    )
}
