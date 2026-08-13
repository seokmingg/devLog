import axios from 'axios'
import {useState, type FormEvent} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {signup} from '../../api/auth.ts'
import styles from './Signup.module.css'

export function Signup() {
    const navigate = useNavigate()
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedNickname = nickname.trim()
        const normalizedEmail = email.trim()

        if (trimmedNickname.length < 2 || trimmedNickname.length > 30) {
            setError('닉네임은 2자 이상 30자 이하로 입력해 주세요.')
            return
        }

        if (password.length < 8 || password.length > 72) {
            setError('비밀번호는 8자 이상 72자 이하로 입력해 주세요.')
            return
        }

        if (password !== passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }

        if (submitting) return

        setSubmitting(true)
        setError(null)

        try {
            await signup({
                email: normalizedEmail,
                password,
                nickname: trimmedNickname,
            })
            navigate('/login', {
                replace: true,
                state: {signupCompleted: true},
            })
        } catch (requestError) {
            if (axios.isAxiosError(requestError) && requestError.response?.status === 409) {
                setError('이미 가입된 이메일입니다.')
            } else {
                setError('회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card} aria-labelledby="signup-title">
                <Link className={styles.brand} to="/"><span>&lt;/&gt;</span>DevLog</Link>

                <div className={styles.heading}>
                    <h1 id="signup-title">회원가입</h1>
                    <p>DevLog에서 개발 기록을 시작해 보세요.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>
                        닉네임
                        <input
                            type="text"
                            value={nickname}
                            minLength={2}
                            maxLength={30}
                            placeholder="사용할 닉네임을 입력하세요"
                            autoComplete="nickname"
                            required
                            onChange={event => setNickname(event.target.value)}
                        />
                    </label>

                    <label>
                        이메일
                        <input
                            type="email"
                            value={email}
                            maxLength={320}
                            placeholder="dev@example.com"
                            autoComplete="email"
                            required
                            onChange={event => setEmail(event.target.value)}
                        />
                    </label>

                    <label>
                        비밀번호
                        <input
                            type="password"
                            value={password}
                            minLength={8}
                            maxLength={72}
                            placeholder="8자 이상 입력하세요"
                            required
                            onChange={event => setPassword(event.target.value)}
                        />
                    </label>

                    <label>
                        비밀번호 확인
                        <input
                            type="password"
                            value={passwordConfirm}
                            minLength={8}
                            maxLength={72}
                            placeholder="비밀번호를 다시 입력하세요"
                            required
                            onChange={event => setPasswordConfirm(event.target.value)}
                        />
                    </label>

                    {error && <p className={styles.error} role="alert">{error}</p>}

                    <button type="submit" disabled={submitting}>
                        {submitting ? '가입하는 중...' : '회원가입'}
                    </button>
                </form>

                <p className={styles.loginLink}>
                    이미 계정이 있나요? <Link to="/login">로그인</Link>
                </p>
            </section>
        </main>
    )
}
