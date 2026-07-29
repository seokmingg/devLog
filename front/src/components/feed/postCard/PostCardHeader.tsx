import type {Post} from '../../../types/feed.ts'
import {Avatar} from '../../common/Avatar.tsx'
import styles from './PostCard.module.css'

type PostCardHeaderProps = Pick<Post, 'author' | 'createdAt'>

export function PostCardHeader({author, createdAt}: PostCardHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.author}>
                <Avatar initials={author.initials} tone={author.tone}/>
                <div>
                    <strong>{author.name}</strong>
                    <span>{createdAt}</span>
                </div>
            </div>
            <button type="button" className={styles.more} aria-label="더 보기">•••</button>
        </header>
    )
}
