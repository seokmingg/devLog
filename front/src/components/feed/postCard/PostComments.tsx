import {useState} from 'react'
import type {CommentResponseDto} from '../../../types/feed.ts'
import {getPostComments} from '../../../api/comments.ts'
import {Avatar} from '../../common/Avatar.tsx'
import {CommentForm} from './CommentForm.tsx'
import styles from './PostCard.module.css'

const COMMENT_PAGE_SIZE = 10

interface PostCommentsProps {
    postId: number
    commentCount: number
}

export function PostComments({postId, commentCount}: PostCommentsProps) {
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [comments, setComments] = useState<CommentResponseDto[]>([])
    const [commentPage, setCommentPage] = useState(0)
    const [hasNextComments, setHasNextComments] = useState(true)
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentsError, setCommentsError] = useState<string | null>(null)
    const commentsId = `comments-${postId}`

    const loadComments = async (page: number) => {
        if (commentsLoading) return

        setCommentsLoading(true)
        setCommentsError(null)

        try {
            const response = await getPostComments(postId, page, COMMENT_PAGE_SIZE)
            setComments(current => page === 0 ? response.content : [...current, ...response.content])
            setCommentPage(response.number)
            setHasNextComments(!response.last)
            setCommentsLoaded(true)
        } catch {
            setCommentsError('댓글 기능을 준비 중입니다.')
        } finally {
            setCommentsLoading(false)
        }
    }

    const toggleComments = async () => {
        if (commentCount === 0) return

        if (commentsOpen) {
            setCommentsOpen(false)
            return
        }

        setCommentsOpen(true)
        if (!commentsLoaded) {
            await loadComments(0)
        }
    }

    return (
        <div className={styles.commentsSection}>
            {commentCount > 0 ? (
                <button
                    type="button"
                    className={styles.commentsToggle}
                    aria-expanded={commentsOpen}
                    aria-controls={commentsId}
                    onClick={toggleComments}
                >
                    댓글 {commentCount}개 {commentsOpen ? '접기' : '모두 보기'}
                </button>
            ) : (
                <span className={styles.muted}>아직 댓글이 없습니다.</span>
            )}

            {commentsOpen && (
                <div id={commentsId} className={styles.commentsList}>
                    {comments.map(comment => (
                        <div className={styles.commentItem} key={comment.id}>
                            <Avatar
                                initials={comment.authorName.slice(0, 2).toUpperCase()}
                                size="tiny"
                            />
                            <div>
                                <div className={styles.commentMeta}>
                                    <strong>{comment.authorName}</strong>
                                    <span>{comment.createdAt}</span>
                                </div>
                                <p>{comment.contents}</p>
                            </div>
                        </div>
                    ))}

                    {commentsError && (
                        <div className={styles.commentsStatus}>
                            <span>{commentsError}</span>
                        </div>
                    )}

                    {commentsLoading && <p className={styles.commentsStatus}>댓글을 불러오는 중...</p>}

                    {!commentsLoading && !commentsError && hasNextComments && (
                        <button
                            type="button"
                            className={styles.loadMore}
                            onClick={() => loadComments(commentPage + 1)}
                        >
                            댓글 10개 더 보기
                        </button>
                    )}
                </div>
            )}

            <CommentForm/>
        </div>
    )
}
