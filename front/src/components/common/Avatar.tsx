import {useState} from 'react'
import type { Tone } from '../../types/feed'
import styles from './Avatar.module.css'

interface AvatarProps {
  initials?: string
  nickname?: string
  size?: 'small' | 'large' | 'tiny'
  tone?: Tone
  imageUrl?: string | null
  alt?: string
}

export function Avatar({
  initials,
  nickname,
  size = 'small',
  tone = 'blue',
  imageUrl,
  alt = '',
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const fallbackInitials = initials
    ?? Array.from(nickname?.trim() ?? '').slice(0, 2).join('').toUpperCase()

  if (imageUrl && !imageFailed) {
    return (
      <img
        className={`${styles.avatar} ${styles.image} ${styles[size]}`}
        src={imageUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return <span className={`${styles.avatar} ${styles[size]} ${styles[tone]}`}>{fallbackInitials}</span>
}
