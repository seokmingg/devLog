import { Avatar } from '../common/Avatar'
import styles from './TechStrip.module.css'

const technologies = [
  { mark: 'J', label: 'Java', color: 'green' },
  { mark: 'S', label: 'Spring', color: 'green' },
  { mark: '⚛', label: 'React', color: 'sky' },
  { mark: '▣', label: 'Docker', color: 'purple' },
  { mark: 'aws', label: 'AWS', color: 'orange' },
]

export function TechStrip() {
  return <section className={styles.strip} aria-label="기술 태그 바로가기">
    <a className={styles.chip} href="#관심-기술"><span className={styles.profile}><Avatar initials="SM" size="large" /><i>+</i></span><span>관심 기술</span></a>
    {technologies.map(({ mark, label, color }) => <a className={styles.chip} href={`#${label}`} key={label}><span className={`${styles.circle} ${styles[color]}`}>{mark}</span><span>{label}</span></a>)}
  </section>
}
