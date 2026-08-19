import {useState} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import type {FormEvent} from 'react'
import {useAuth} from '../../auth/useAuth.ts'
import { Avatar } from '../common/Avatar'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentQuery = searchParams.get('q') ?? ''
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const query = String(form.get('query') ?? '').trim()
    const nextParams = new URLSearchParams(searchParams)

    if (query) nextParams.set('q', query)
    else nextParams.delete('q')

    const search = nextParams.toString()
    navigate(search ? `/?${search}` : '/')
  }

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('q')
    const search = nextParams.toString()
    navigate(search ? `/?${search}` : '/')
  }

  return (
    <header className={styles.header}>
      <Link className={styles.mobileBrand} to="/">DevLog</Link>
      <form className={styles.search} role="search" onSubmit={handleSearch}>
        <button className={styles.searchIcon} type="submit" aria-label="게시글 검색">⌕</button>
        <input key={currentQuery} name="query" type="search" defaultValue={currentQuery} maxLength={100} placeholder="제목 또는 내용 검색" aria-label="게시글 검색어" />
        {currentQuery && <button className={styles.clearSearch} type="button" aria-label="검색어 지우기" onClick={clearSearch}>×</button>}
      </form>
      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="알림">♡</button>
        <Link className={styles.createButton} to="/posts/new" aria-label="새 글 작성">＋</Link>
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
