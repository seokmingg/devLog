import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {createPost} from '../../api/feed/postCard/posts.ts'
import {getTechnologyTags} from '../../api/tag.ts'
import type {TechnologyTagDto} from '../../types/tag.ts'
import styles from './PostWrite.module.css'

export function PostWrite() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [contents, setContents] = useState('')
    const [kind, setKind] = useState<'text' | 'code'>('text')
    const [tags, setTags] = useState<TechnologyTagDto[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [loadingTags, setLoadingTags] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        getTechnologyTags()
            .then(response => {
                if (active) setTags(response)
            })
            .catch(() => {
                if (active) setError('기술 태그를 불러오지 못했습니다.')
            })
            .finally(() => {
                if (active) setLoadingTags(false)
            })

        return () => {
            active = false
        }
    }, [])

    const toggleTag = (tagId: number) => {
        setError(null)
        setSelectedTagIds(current => {
            if (current.includes(tagId)) return current.filter(id => id !== tagId)
            if (current.length >= 5) {
                setError('기술 태그는 최대 5개까지 선택할 수 있습니다.')
                return current
            }
            return [...current, tagId]
        })
    }

    const handleSubmit = async () => {
        const trimmedTitle = title.trim()
        const trimmedContents = contents.trim()
        if (!trimmedTitle) {
            setError('제목을 입력해 주세요.')
            return
        }
        if (!trimmedContents) {
            setError('내용을 입력해 주세요.')
            return
        }
        if (submitting) return

        setSubmitting(true)
        setError(null)
        try {
            await createPost({
                title: trimmedTitle,
                contents: trimmedContents,
                kind,
                tagIds: selectedTagIds,
            })
            navigate('/', {replace: true})
        } catch {
            setError('게시글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.')
            setSubmitting(false)
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.editor} aria-labelledby="post-write-title">
                <div className={styles.heading}>
                    <div>
                        <h1 id="post-write-title">새 글 작성</h1>
                        <p>오늘 배운 내용과 개발 경험을 기록해 보세요.</p>
                    </div>
                    <button type="button" onClick={() => navigate(-1)}>취소</button>
                </div>

                <label className={styles.field}>
                    <span>제목</span>
                    <input
                        type="text"
                        value={title}
                        maxLength={200}
                        placeholder="제목을 입력해 주세요"
                        onChange={event => setTitle(event.target.value)}
                    />
                    <small>{title.length}/200</small>
                </label>

                <div className={styles.modeSection}>
                    <span>작성 모드</span>
                    <div className={styles.modeButtons}>
                        <button
                            type="button"
                            className={kind === 'text' ? styles.activeMode : undefined}
                            aria-pressed={kind === 'text'}
                            onClick={() => setKind('text')}
                        >
                            일반 글
                        </button>
                        <button
                            type="button"
                            className={kind === 'code' ? styles.activeMode : undefined}
                            aria-pressed={kind === 'code'}
                            onClick={() => setKind('code')}
                        >
                            &lt;/&gt; 코드
                        </button>
                    </div>
                </div>

                <label className={styles.field}>
                    <span>{kind === 'code' ? '코드' : '내용'}</span>
                    <textarea
                        className={kind === 'code' ? styles.codeEditor : undefined}
                        value={contents}
                        maxLength={10000}
                        placeholder={kind === 'code' ? '코드를 입력해 주세요' : '내용을 입력해 주세요'}
                        spellCheck={kind !== 'code'}
                        onChange={event => setContents(event.target.value)}
                    />
                    <small>{contents.length}/10,000</small>
                </label>

                <section className={styles.tags} aria-labelledby="post-tags-title">
                    <div>
                        <h2 id="post-tags-title">기술 태그</h2>
                        <span>{selectedTagIds.length}/5</span>
                    </div>
                    {loadingTags ? (
                        <p>기술 태그를 불러오는 중...</p>
                    ) : (
                        <div className={styles.tagList}>
                            {tags.map(tag => {
                                const selected = selectedTagIds.includes(tag.id)
                                return (
                                    <button
                                        type="button"
                                        className={selected ? styles.selected : undefined}
                                        aria-pressed={selected}
                                        onClick={() => toggleTag(tag.id)}
                                        key={tag.id}
                                    >
                                        {tag.name}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </section>

                {error && <p className={styles.error} role="alert">{error}</p>}

                <div className={styles.actions}>
                    <button type="button" onClick={() => navigate(-1)}>취소</button>
                    <button type="button" className={styles.submit} disabled={submitting} onClick={handleSubmit}>
                        {submitting ? '등록 중...' : '게시하기'}
                    </button>
                </div>
            </section>
        </main>
    )
}
