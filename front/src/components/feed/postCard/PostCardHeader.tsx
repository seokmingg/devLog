import {useEffect, useRef, useState} from 'react'
import type {Post} from '../../../types/feed.ts'
import {Avatar} from '../../common/Avatar.tsx'
import {deletePost} from '../../../api/feed/postCard/posts.ts'
import {useNavigate} from 'react-router-dom'
import styles from './PostCard.module.css'
import {formatRelativeTime} from './postComments/commentUtils.ts'

interface PostCardHeaderProps extends Pick<Post, 'author' | 'createdAt'> {
    postId: number
    isMine: boolean
    onDelete: (postId: number) => void
}

export function PostCardHeader({postId, author, createdAt, isMine, onDelete}: PostCardHeaderProps) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuMessage, setMenuMessage] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const menuId = `post-menu-${postId}`

    useEffect(() => {
        if (!menuOpen) return

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', closeOnOutsideClick)
        document.addEventListener('keydown', closeOnEscape)

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [menuOpen])

    const showPreparingMessage = (message: string) => {
        setMenuMessage(message)
        setMenuOpen(false)
    }

    const handleDelete = async () => {
        if (deleting) return
        if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return

        setDeleting(true)
        setMenuMessage(null)
        try {
            await deletePost(postId)
            onDelete(postId)
        } catch {
            setMenuOpen(false)
            setMenuMessage('게시글을 삭제하지 못했습니다.')
            setDeleting(false)
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.author}>
                <Avatar
                    initials={author.initials}
                    nickname={author.name}
                    imageUrl={author.profileImageUrl}
                    tone={author.tone}
                    alt={`${author.name} 프로필`}
                />
                <div>
                    <strong>{author.name}</strong>
                    <span>{formatRelativeTime(createdAt)}</span>
                </div>
            </div>

            <div className={styles.postMenu} ref={menuRef}>
                <button
                    type="button"
                    className={styles.more}
                    aria-label="게시글 메뉴"
                    aria-expanded={menuOpen}
                    aria-controls={menuId}
                    onClick={() => {
                        setMenuMessage(null)
                        setMenuOpen(open => !open)
                    }}
                >
                    •••
                </button>

                {menuOpen && (
                    <div id={menuId} className={styles.postMenuList} role="menu">
                        {isMine ? (
                            <>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => navigate(`/posts/${postId}/edit`)}
                                >
                                    수정
                                </button>
                                <button
                                    type="button"
                                    className={styles.dangerMenuItem}
                                    role="menuitem"
                                    disabled={deleting}
                                    onClick={handleDelete}
                                >
                                    {deleting ? '삭제 중...' : '삭제'}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className={styles.dangerMenuItem}
                                role="menuitem"
                                onClick={() => showPreparingMessage('게시글 신고 기능을 준비 중입니다.')}
                            >
                                신고
                            </button>
                        )}
                    </div>
                )}

                {menuMessage && (
                    <span className={styles.menuMessage} role="status">
                        {menuMessage}
                    </span>
                )}
            </div>
        </header>
    )
}
