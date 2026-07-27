import { Link } from 'react-router-dom'
import { Avatar } from '../common/Avatar'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <Link className={styles.mobileBrand} to="/">DevLog</Link>
      <label className={styles.search}><span>⌕</span><input type="search" placeholder="검색" aria-label="검색" /></label>
      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="알림">♡</button>
        <button className={styles.createButton} aria-label="새 글 작성">＋</button>
        <Link className={styles.profileButton} to="/login" aria-label="로그인"><Avatar initials="SM" /></Link>
      </div>
    </header>
  )
}
