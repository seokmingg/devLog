import {useState} from 'react'
import type {FormEvent} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styles from './Login.module.css'

export function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // TODO: 백엔드 로그인 API를 연결한 뒤 성공 시 이동하도록 변경합니다.
        navigate('/')
    }

    return (
        <main className={styles.page}>
            <section className={styles.card} aria-labelledby="login-title">
                <Link className={styles.brand} to="/"><span>&lt;/&gt;</span>DevLog</Link>
                <div className={styles.heading}>
                    <h1 id="login-title">로그인</h1>
                    <p>개발 기록을 이어서 작성해 보세요.</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>이메일<input type="email" value={email} onChange={event => setEmail(event.target.value)}
                                     placeholder="dev@example.com" autoComplete="email" required/></label>
                    <label>비밀번호<input type="password" value={password}
                                      onChange={event => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요"
                                      autoComplete="current-password" required/></label>
                    <div className={styles.options}><label><input type="checkbox"/> 로그인 유지</label><a href="#비밀번호-찾기">비밀번호
                        찾기</a></div>
                    <button type="submit">로그인</button>
                </form>
                <p className={styles.signup}>아직 계정이 없나요? <a href="#회원가입">회원가입</a></p>
            </section>
        </main>
    )
}
