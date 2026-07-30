import {Avatar} from '../../common/Avatar.tsx'
import styles from './PostCard.module.css'

export function CommentForm() {
    return (
        <div className={styles.comment}>
            <Avatar initials="SM" size="tiny"/>
            <span>댓글 달기...</span>
            <span>☺</span>
        </div>
    )
}
