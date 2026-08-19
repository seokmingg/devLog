import {useState, type FormEvent} from 'react'
import {createPostComment} from '../../../../api/feed/postCard/comments.ts'
import {useAuth} from '../../../../auth/useAuth.ts'
import {Avatar} from '../../../common/Avatar.tsx'
import styles from '../PostCard.module.css'

interface CommentFormProps {
    postId: number
    onCommentCreated: () => Promise<void>
}

export function CommentForm({postId, onCommentCreated}: CommentFormProps) {
    const {member} = useAuth()
    const [contents, setContents] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const submitComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedContents = contents.trim()
        if (!trimmedContents || submitting) return

        setSubmitting(true)
        setSubmitError(null)

        try {
            await createPostComment(postId, trimmedContents)
            setContents('')
            await onCommentCreated()
        } catch {
            setSubmitError('댓글을 등록하지 못했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <form className={styles.comment} onSubmit={submitComment}>
                <Avatar
                    nickname={member?.nickname}
                    imageUrl={member?.profileImageUrl}
                    alt={member ? `${member.nickname} 프로필` : '내 프로필'}
                    size="tiny"
                />
                <input
                    type="text"
                    value={contents}
                    placeholder="댓글 달기..."
                    aria-label="댓글 내용"
                    maxLength={500}
                    onChange={event => setContents(event.target.value)}
                />
                <button type="submit" disabled={!contents.trim() || submitting}>
                    {submitting ? '등록 중' : '게시'}
                </button>
            </form>
            {submitError && <p className={styles.commentError}>{submitError}</p>}
        </>
    )
}
