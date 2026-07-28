import {useState} from 'react'
import type {CommentResponseDto, Post} from '../../../types/feed.ts'
import {getPostComments} from '../../../api/comments.ts'
import {Avatar} from '../../common/Avatar.tsx'
import styles from './PostCard.module.css'

const COMMENT_PAGE_SIZE = 10

export function PostCard({post}: { post: Post }) {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [comments, setComments] = useState<CommentResponseDto[]>([])
    const [commentPage, setCommentPage] = useState(0)
    const [hasNextComments, setHasNextComments] = useState(true)
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentsError, setCommentsError] = useState<string | null>(null)
    const likeCount = post.likes + (liked ? 1 : 0)
    const commentsId = `comments-${post.id}`

    const loadComments = async (page: number) => {
        if (commentsLoading) return

        setCommentsLoading(true)
        setCommentsError(null)

        try {
            const response = await getPostComments(post.id, page, COMMENT_PAGE_SIZE)
            setComments(current => page === 0 ? response.content : [...current, ...response.content])
            setCommentPage(response.number)
            setHasNextComments(!response.last)
            setCommentsLoaded(true)
        } catch {
            // 백엔드 댓글 API가 준비되기 전까지 기술 오류를 사용자에게 노출하지 않는다.
            setCommentsError('댓글 기능을 준비 중입니다.')
        } finally {
            setCommentsLoading(false)
        }
    }

    const toggleComments = async () => {
        if (post.commentCount === 0) return

        if (commentsOpen) {
            setCommentsOpen(false)
            return
        }

        setCommentsOpen(true)
        if (!commentsLoaded) {
            await loadComments(0)
        }
    }

    return <article className={styles.card}>
        <header className={styles.header}>
            <div className={styles.author}><Avatar initials={post.author.initials} tone={post.author.tone}/>
                <div><strong>{post.author.name}</strong><span>{post.createdAt}</span></div>
            </div>
            <button className={styles.more} aria-label="더 보기">•••</button>
        </header>

        {post.kind === 'code' ? <pre className={styles.code} aria-label={`${post.title} 코드`}><code>{post.contents}</code></pre> :
            <div className={styles.diagram}><h3>{post.title}</h3>
                <div><span>Request</span><b>→</b><span>Authentication<br/>Filter</span><b>→</b><span>User Details<br/>Service</span><b>↔</b><span>DB</span>
                </div>
            </div>}

        <>
            <div className={styles.actions}>
                <div>
                    <button className={liked ? styles.selected : ''} onClick={() => setLiked(value => !value)}
                            aria-label="좋아요">{liked ? '♥' : '♡'}</button>
                    <button
                        type="button"
                        aria-label="댓글 보기"
                        aria-expanded={commentsOpen}
                        aria-controls={commentsId}
                        onClick={toggleComments}
                    >◯</button>
                </div>
                <button className={saved ? styles.selected : ''} onClick={() => setSaved(value => !value)}
                        aria-label="저장">{saved ? '▰' : '▱'}</button>
            </div>
            <div className={styles.body}>
                <strong>좋아요 {likeCount}개</strong>
                <p><b>{post.author.name}</b> {post.title}</p>
                {post.kind !== 'code' && <p>{post.contents}</p>}
                <p className={styles.hashtags}>{post.hashtags?.map(tag => `#${tag}`).join(' ')}</p>
                {post.commentCount > 0 ? (
                    <button
                        type="button"
                        className={styles.commentsToggle}
                        aria-expanded={commentsOpen}
                        aria-controls={commentsId}
                        onClick={toggleComments}
                    >
                        댓글 {post.commentCount}개 {commentsOpen ? '접기' : '모두 보기'}
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

                <div className={styles.comment}><Avatar initials="SM" size="tiny"/><span>댓글 달기...</span><span>☺</span>
                </div>
            </div>
        </>
    </article>
}
