import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../auth/useAuth.ts'
import { Avatar } from '../common/Avatar'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  const {member, authLoading, logout} = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      await logout()
    } finally {
      navigate('/login', {replace: true})
      setLoggingOut(false)
    }
  }

  return (
    <header className={styles.header}>
      <Link className={styles.mobileBrand} to="/">DevLog</Link>
      <label className={styles.search}><span>⌕</span><input type="search" placeholder="검색" aria-label="검색" /></label>
      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="알림">♡</button>
        <button className={styles.createButton} aria-label="새 글 작성">＋</button>
        {authLoading || !member ? (
          <span className={styles.profileLoading} aria-label="로그인 상태 확인 중"/>
        ) : (
          <>
            <Link className={styles.profile} to="/mypage" aria-label="마이페이지">
              <Avatar
                nickname={member.nickname}
                imageUrl={member.profileImageUrl}
                alt={`${member.nickname} 프로필`}
              />
              <strong>{member.nickname}님</strong>
            </Link>
            <button
              type="button"
              className={styles.logoutButton}
              disabled={loggingOut}
              onClick={handleLogout}
              aria-label={loggingOut ? '로그아웃 처리 중' : '로그아웃'}
            >
              <span className={styles.logoutText}>{loggingOut ? '처리 중...' : '로그아웃'}</span>
              <svg
                className={styles.logoutIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M10 5H6.8A1.8 1.8 0 0 0 5 6.8v10.4A1.8 1.8 0 0 0 6.8 19H10M14.5 8.5 18 12l-3.5 3.5M9 12h9"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
