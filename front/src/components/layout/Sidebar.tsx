import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const navItems = [['⌂', '홈'], ['#', '기술'], ['♙', '친구'], ['＋', '글쓰기'], ['▱', '저장한 글'], ['♧', '알림'], ['○', '내 프로필']]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} to="/" aria-label="DevLog 메인"><span>&lt;/&gt;</span>DevLog</Link>
      <nav className={styles.nav} aria-label="주 메뉴">
        {navItems.map(([icon, label], index) => (
          label === '내 프로필' ? <Link key={label} className={styles.item} to="/mypage"><span className={styles.icon}>{icon}</span><span>{label}</span></Link>
          : label === '글쓰기' ? <Link key={label} className={styles.item} to="/posts/new"><span className={styles.icon}>{icon}</span><span>{label}</span></Link>
          : <a key={label} className={`${styles.item} ${index === 0 ? styles.active : ''}`} href={index === 0 ? '/' : `#${label}`}>
            <span className={styles.icon}>{icon}</span><span>{label}</span>
          </a>
        ))}
      </nav>
      <footer className={styles.footer}>
        <strong>DevLog Inc.</strong><span>대표 : 홍석민</span><span>사업자등록번호 : 123-45-67890</span>
        <span>대표번호 : 010-1234-5678</span><span>대전 중구 중촌동 123</span><small>© 2026 DevLog</small>
      </footer>
    </aside>
  )
}
