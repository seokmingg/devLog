import {useState} from 'react'
import {likePost, unlikePost} from '../../../api/feed/postCard/likes.ts'
import styles from './PostCard.module.css'

interface PostActionsProps {
    postId: number
    likeCount: number
    likedByMe: boolean
    onPostRefresh: (postId: number) => Promise<void>
}

export function PostActions({postId, likeCount, likedByMe, onPostRefresh}: PostActionsProps) {
    const [likeLoading, setLikeLoading] = useState(false)
    const [likeError, setLikeError] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)

    const handleLike = async () => {
        if (likeLoading) return

        setLikeLoading(true)
        setLikeError(null)

        try {
            if (likedByMe) {
                await unlikePost(postId)
            } else {
                await likePost(postId)
            }

            await onPostRefresh(postId)
        } catch {
            setLikeError('좋아요 처리에 실패했습니다.')
        } finally {
            setLikeLoading(false)
        }
    }

    return (
        <div className={styles.actionsSection}>
            <div className={styles.actions}>
                <div className={styles.likes}>
                    <button
                        type="button"
                        className={likedByMe ? styles.selected : ''}
                        disabled={likeLoading}
                        onClick={handleLike}
                        aria-label={likedByMe ? '좋아요 취소' : '좋아요'}
                    >
                        {likedByMe ? '♥' : '♡'}
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
            {likeError && <p className={styles.actionError}>{likeError}</p>}
        </div>
    )
}
