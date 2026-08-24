import axios from 'axios'
import {useState} from 'react'
import type {FormEvent} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import styles from './Login.module.css'
import {useAuth} from '../../auth/useAuth.ts'
// import {Avatar} from "../../components/common/Avatar.tsx";

export function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const {login} = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const signupCompleted = Boolean(
        (location.state as {signupCompleted?: boolean} | null)?.signupCompleted
    )
    const googleLoginUrl = `${import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'}/oauth2/authorization/google`


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (submitting) return

        setSubmitting(true)
        setError(null)

        try {
            await login(email.trim(), password)
            navigate('/', {replace: true})
        } catch (requestError) {
            if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.')
            } else if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
                setError('사용할 수 없는 계정입니다.')
            } else {
                setError('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = googleLoginUrl
    }

    return (
        <main className={styles.page}>
            <section className={styles.card} aria-labelledby="login-title">
                <Link className={styles.brand} to="/"><span>&lt;/&gt;</span>DevLog</Link>
                <div className={styles.heading}>
                    <h1 id="login-title">로그인</h1>
                    <p>개발 기록을 이어서 작성해 보세요.</p>
                    {/*<p>id:guest@guest.com</p>*/}
                    {/*<p>pw:12345678</p>*/}
                </div>
                {signupCompleted && (
                    <p className={styles.success} role="status">
                        회원가입이 완료되었습니다. 로그인해 주세요.
                    </p>
                )}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>이메일<input type="email" value={email} onChange={event => setEmail(event.target.value)}
                                     placeholder="dev@example.com" autoComplete="email" required/></label>
                    <label>비밀번호<input type="password" value={password}
                                      onChange={event => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요"
                                      autoComplete="current-password" required/></label>

                    {error && <p className={styles.error} role="alert">{error}</p>}

                    {/*todo 로그인 유지,비밀번호찾기*/}
                    {/*<div className={styles.options}><label><input type="checkbox"/> 로그인 유지</label><a href="#비밀번호-찾기">비밀번호 찾기</a></div>*/}
                    <button type="submit" disabled={submitting}>
                        {submitting ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <div className={styles.divider}><span>또는</span></div>
                <button
                    type="button"
                    className={styles.googleButton}
                    onClick={handleGoogleLogin}
                >
                    <span className={styles.googleMark} aria-hidden="true">G</span>
                    Google로 계속하기
                </button>
                {/*<p className={styles.signup}>아직 계정이 없나요? <a href="#회원가입">회원가입</a></p>*/}
                <p className={styles.signup}>아직 계정이 없나요?

                    <Link className={styles.signup} to="/signup" >회원가입</Link>
                </p>

            </section>
        </main>
    )
}
