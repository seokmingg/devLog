import {useEffect, useRef, useState} from 'react'
import type {Post} from '../../../types/feed.ts'
import {Avatar} from '../../common/Avatar.tsx'
import styles from './PostCard.module.css'

interface PostCardHeaderProps extends Pick<Post, 'author' | 'createdAt'> {
    postId: number
    isMine: boolean
}

export function PostCardHeader({postId, author, createdAt, isMine}: PostCardHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuMessage, setMenuMessage] = useState<string | null>(null)
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

    return (
        <header className={styles.header}>
            <div className={styles.author}>
                <Avatar initials={author.initials} tone={author.tone}/>
                <div>
                    <strong>{author.name}</strong>
                    <span>{createdAt}</span>
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
                                    onClick={() => showPreparingMessage('게시글 수정 기능을 준비 중입니다.')}
                                >
                                    수정
                                </button>
                                <button
                                    type="button"
                                    className={styles.dangerMenuItem}
                                    role="menuitem"
                                    onClick={() => showPreparingMessage('게시글 삭제 기능을 준비 중입니다.')}
                                >
                                    삭제
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
