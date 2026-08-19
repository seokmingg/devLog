import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {createPost, getPost, updatePost} from '../../api/feed/postCard/posts.ts'
import {getTechnologyTags} from '../../api/tag.ts'
import type {TechnologyTagDto} from '../../types/tag.ts'
import styles from './PostWrite.module.css'

export function PostWrite() {
    const navigate = useNavigate()
    const {postId} = useParams()
    const editing = postId !== undefined
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
        Promise.all([
            getTechnologyTags(),
            editing ? getPost(Number(postId)) : Promise.resolve(null),
        ])
            .then(([tagResponse, postResponse]) => {
                if (!active) return
                setTags(tagResponse)

                if (postResponse) {
                    if (!postResponse.isMine) {
                        throw new Error('not-owner')
                    }
                    setTitle(postResponse.title)
                    setContents(postResponse.contents)
                    setKind(postResponse.kind === 'code' ? 'code' : 'text')
                    const hashtagNames = new Set(postResponse.hashtags.map(tag => tag.toLowerCase()))
                    setSelectedTagIds(tagResponse
                        .filter(tag => hashtagNames.has(tag.name.toLowerCase()))
                        .map(tag => tag.id))
                }
            })
            .catch(() => {
                if (active) setError(editing
                    ? '수정할 게시글을 불러오지 못했거나 수정 권한이 없습니다.'
                    : '기술 태그를 불러오지 못했습니다.')
            })
            .finally(() => {
                if (active) setLoadingTags(false)
            })

        return () => {
            active = false
        }
    }, [editing, postId])

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
            const request = {
                title: trimmedTitle,
                contents: trimmedContents,
                kind,
                tagIds: selectedTagIds,
            }
            if (editing) {
                await updatePost(Number(postId), request)
            } else {
                await createPost(request)
            }
            navigate('/', {replace: true})
        } catch {
            setError(editing
                ? '게시글을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.'
                : '게시글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.')
            setSubmitting(false)
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.editor} aria-labelledby="post-write-title">
                <div className={styles.heading}>
                    <div>
                        <h1 id="post-write-title">{editing ? '게시글 수정' : '새 글 작성'}</h1>
                        <p>{editing ? '작성한 게시글의 내용을 수정합니다.' : '오늘 배운 내용과 개발 경험을 기록해 보세요.'}</p>
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
                        {submitting ? (editing ? '수정 중...' : '등록 중...') : (editing ? '수정 완료' : '게시하기')}
                    </button>
                </div>
            </section>
        </main>
    )
}
