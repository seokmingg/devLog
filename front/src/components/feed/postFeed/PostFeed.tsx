import {PostCard} from '../postCard/PostCard.tsx'
import {TechStrip} from '../techStrip/TechStrip.tsx'
import {usePostFeed} from './usePostFeed.ts'
import styles from './PostFeed.module.css'

export function PostFeed() {
    const {
        feedPosts,
        initialLoading,
        loadingMore,
        feedError,
        hasNext,
        loadMoreRef,
        refreshPost,
    } = usePostFeed()

    return (
        <section className={styles.feed} aria-label="게시글 피드">
            <TechStrip/>

            {initialLoading && (
                <p className={styles.loading}>◌ 게시글을 불러오는 중...</p>
            )}

            {!initialLoading && feedPosts.map(post => (
                <PostCard post={post} onRefresh={refreshPost} key={post.id}/>
            ))}

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
