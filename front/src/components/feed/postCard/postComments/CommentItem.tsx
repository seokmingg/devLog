import {useLayoutEffect, useRef, useState} from 'react'
import type {CommentResponseDto} from '../../../../types/feed.ts'
import {Avatar} from '../../../common/Avatar.tsx'
import {formatRelativeTime} from './commentUtils.ts'
import styles from '../PostCard.module.css'

export function CommentItem({comment}: { comment: CommentResponseDto }) {
    const [expanded, setExpanded] = useState(false)
    const [canExpand, setCanExpand] = useState(false)
    const contentsRef = useRef<HTMLParagraphElement>(null)

    useLayoutEffect(() => {
        const contentsElement = contentsRef.current
        if (!contentsElement || expanded) return

        const checkOverflow = () => {
            setCanExpand(contentsElement.scrollHeight > contentsElement.clientHeight + 1)
        }

        checkOverflow()
        const resizeObserver = new ResizeObserver(checkOverflow)
        resizeObserver.observe(contentsElement)

        return () => resizeObserver.disconnect()
    }, [comment.contents, expanded])

    return (
        <div className={styles.commentItem}>
            <Avatar
                initials={comment.authorName.slice(0, 2).toUpperCase()}
                nickname={comment.authorName}
                imageUrl={comment.authorProfileImageUrl}
                alt={`${comment.authorName} 프로필`}
                size="tiny"
            />
            <div>
                <div className={styles.commentMeta}>
                    <strong>{comment.authorName}</strong>
                    <span>{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p
                    ref={contentsRef}
                    className={expanded ? '' : styles.commentContentsCollapsed}
                >
                    {comment.contents}
                </p>
                {canExpand && (
                    <button
                        type="button"
                        className={styles.commentExpandButton}
                        aria-expanded={expanded}
                        onClick={() => setExpanded(value => !value)}
                    >
                        {expanded ? '접기' : '더 보기'}
                    </button>
                )}
            </div>
        </div>
    )
}
