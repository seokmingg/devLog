import {useState} from 'react'
import styles from './PostCard.module.css'

export function PostActions({initialLikeCount}: { initialLikeCount: number }) {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const likeCount = initialLikeCount + (liked ? 1 : 0)

    return (
        <div className={styles.actionsSection}>
            <div className={styles.actions}>
                <div className={styles.likes}>
                    <button
                        type="button"
                        className={liked ? styles.selected : ''}
                        onClick={() => setLiked(value => !value)}
                        aria-label="좋아요"
                    >
                        {liked ? '♥' : '♡'}
                    </button>
                    <strong>좋아요 {likeCount}개</strong>
                </div>
                <button
                    type="button"
                    className={saved ? styles.selected : ''}
                    onClick={() => setSaved(value => !value)}
                    aria-label="저장"
                >
                    {saved ? '▰' : '▱'}
                </button>
            </div>
        </div>
    )
}
