import styles from './BottomNav.module.css'

export function BottomNav() {
  return <nav className={styles.nav} aria-label="모바일 메뉴">
    {[['⌂', '홈'], ['⌕', '검색'], ['＋', '글쓰기'], ['#', '기술'], ['○', '프로필']].map(([icon, label], index) =>
      <a key={label} className={`${index === 0 ? styles.active : ''} ${index === 2 ? styles.create : ''}`} href={index === 0 ? '/' : `#${label}`}><span>{icon}</span><small>{label}</small></a>)}
  </nav>
}
