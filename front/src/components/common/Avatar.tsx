import type { Tone } from '../../types/feed'
import styles from './Avatar.module.css'

interface AvatarProps {
  initials: string
  size?: 'small' | 'large' | 'tiny'
  tone?: Tone
}

export function Avatar({ initials, size = 'small', tone = 'blue' }: AvatarProps) {
  return <span className={`${styles.avatar} ${styles[size]} ${styles[tone]}`}>{initials}</span>
}
