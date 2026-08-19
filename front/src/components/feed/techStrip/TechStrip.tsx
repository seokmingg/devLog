import { Avatar } from '../../common/Avatar.tsx'
import {useAuth} from '../../../auth/useAuth.ts'
import {Link} from 'react-router-dom'
import styles from './TechStrip.module.css'

const tagStyles: Record<string, {mark: string; color: string}> = {
  java: {mark: 'J', color: 'green'},
  spring: {mark: 'S', color: 'green'},
  react: {mark: '⚛', color: 'sky'},
  docker: {mark: '▣', color: 'purple'},
  aws: {mark: 'aws', color: 'orange'},
  html: {mark: 'H', color: 'orange'},
  css: {mark: 'C', color: 'sky'},
  javascript: {mark: 'JS', color: 'yellow'},
  typescript: {mark: 'TS', color: 'blue'},
  python: {mark: 'Py', color: 'blue'},
}

export function TechStrip() {
  const {member} = useAuth()

  return <section className={styles.strip} aria-label="기술 태그 바로가기">
    <Link className={styles.chip} to="/mypage"><span className={styles.profile}><Avatar nickname={member?.nickname} imageUrl={member?.profileImageUrl} alt={member ? `${member.nickname} 프로필` : '내 프로필'} size="large" /><i>+</i></span><span>관심 기술</span></Link>
    {member?.interests.map(tag => {
      const visual = tagStyles[tag.slug] ?? {mark: tag.name.slice(0, 2), color: 'green'}
      return <a className={styles.chip} href={`#${tag.slug}`} key={tag.id}><span className={`${styles.circle} ${styles[visual.color]}`}>{visual.mark}</span><span>{tag.name}</span></a>
    })}
  </section>
}
