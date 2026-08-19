import {PostCard} from '../postCard/PostCard.tsx'
import {TechStrip} from '../techStrip/TechStrip.tsx'
import {usePostFeed} from './usePostFeed.ts'
import styles from './PostFeed.module.css'
import {Link, useSearchParams} from 'react-router-dom'

const tagLabels: Record<string, string> = {
    java: 'Java', spring: 'Spring', react: 'React', docker: 'Docker', aws: 'AWS',
    html: 'HTML', css: 'CSS', javascript: 'JavaScript', typescript: 'TypeScript', python: 'Python',
}

export function PostFeed() {
    const [searchParams] = useSearchParams()
    const selectedTag = searchParams.get('tag') ?? undefined
    const query = searchParams.get('q')?.trim() || undefined
    const {
        feedPosts,
        initialLoading,
        loadingMore,
        feedError,
        hasNext,
        loadMoreRef,
        refreshPost,
        removePost,
    } = usePostFeed(selectedTag, query)

    return (
        <section className={styles.feed} aria-label="게시글 피드">
            <TechStrip/>

            {(selectedTag || query) && (
                <div className={styles.filterBar}>
                    <strong>
                        {selectedTag && `#${tagLabels[selectedTag] ?? selectedTag}`}
                        {selectedTag && query && ' · '}
                        {query && `“${query}” 검색 결과`}
                    </strong>
                    <Link to="/">전체 글 보기</Link>
                </div>
            )}

            {initialLoading && (
                <p className={styles.loading}>◌ 게시글을 불러오는 중...</p>
            )}

            {!initialLoading && feedPosts.map(post => (
                <PostCard post={post} onRefresh={refreshPost} onDelete={removePost} key={post.id}/>
            ))}

            {!initialLoading && !feedError && feedPosts.length === 0 && (
                <div className={styles.empty}>
                    <strong>
                        {query
                            ? `“${query}” 검색 결과가 없습니다.`
                            : selectedTag
                                ? `#${tagLabels[selectedTag] ?? selectedTag} 게시글이 없습니다.`
                                : '게시글이 없습니다.'}
                    </strong>
                    <p>다른 관심 기술을 선택하거나 새로운 글을 작성해 보세요.</p>
                    <Link to="/">전체 글 보기</Link>
                </div>
            )}

            {feedError && <p className={styles.error}>{feedError}</p>}

            {loadingMore && (
                <p className={styles.loading}>◌ 다음 게시글을 불러오는 중...</p>
            )}

            <div ref={loadMoreRef} className={styles.loadMoreTrigger} aria-hidden="true"/>

            {!initialLoading && !hasNext && feedPosts.length > 0 && (
                <p className={styles.endMessage}>모든 게시글을 확인했습니다.</p>
            )}
        </section>
    )
}
