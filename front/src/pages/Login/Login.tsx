import {useState} from 'react'
import type {FormEvent} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import styles from './Login.module.css'
// import {Avatar} from "../../components/common/Avatar.tsx";

export function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const signupCompleted = Boolean(
        (location.state as {signupCompleted?: boolean} | null)?.signupCompleted
    )
    // const googleLoginUrl = `${import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'}/oauth2/authorization/google`


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // TODO: 백엔드 로그인 API를 연결한 뒤 성공 시 이동하도록 변경합니다.
        navigate('/')
    }

    // const handleGoogleLogin = () => {
    //     window.location.href = googleLoginUrl
    // }

    return (
        <main className={styles.page}>
            <section className={styles.card} aria-labelledby="login-title">
                <Link className={styles.brand} to="/"><span>&lt;/&gt;</span>DevLog</Link>
                <div className={styles.heading}>
                    <h1 id="login-title">로그인</h1>
                    <p>개발 기록을 이어서 작성해 보세요.</p>
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

                    {/*todo 로그인 유지,비밀번호찾기*/}
                    {/*<div className={styles.options}><label><input type="checkbox"/> 로그인 유지</label><a href="#비밀번호-찾기">비밀번호 찾기</a></div>*/}
                    <button type="submit">로그인</button>
                </form>
                <div className={styles.divider}><span>또는</span></div>
                {/*<button*/}
                {/*    type="button"*/}
                {/*    className={styles.googleButton}*/}
                {/*    onClick={handleGoogleLogin}*/}
                {/*>*/}
                {/*    <span className={styles.googleMark} aria-hidden="true">G</span>*/}
                {/*    Google로 계속하기*/}
                {/*</button>*/}
                {/*<p className={styles.signup}>아직 계정이 없나요? <a href="#회원가입">회원가입</a></p>*/}
                <p className={styles.signup}>아직 계정이 없나요?

                    <Link className={styles.signup} to="/signup" >회원가입</Link>
                </p>

            </section>
        </main>
    )
}
