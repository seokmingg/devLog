import type {Post} from '../../../types/feed.ts'
import {PostActions} from './PostActions.tsx'
import {PostCardContent} from './PostCardContent.tsx'
import {PostCardHeader} from './PostCardHeader.tsx'
import {PostComments} from './postComments/PostComments.tsx'
import styles from './PostCard.module.css'

interface PostCardProps {
    post: Post
    onRefresh: (postId: number) => Promise<void>
}

export function PostCard({post, onRefresh}: PostCardProps) {
    return (
        <article className={styles.card}>
            <PostCardHeader
                postId={post.id}
                author={post.author}
                createdAt={post.createdAt}
                isMine={post.isMine ?? false}
            />
            <PostCardContent
                title={post.title}
                contents={post.contents}
                kind={post.kind}
                hashtags={post.hashtags}
            />
            <PostActions
                postId={post.id}
                likeCount={post.likes}
                likedByMe={post.likedByMe}
                onPostRefresh={onRefresh}
            />
            <PostComments
                postId={post.id}
                commentCount={post.commentCount}
                onPostRefresh={onRefresh}
            />
        </article>
    )
}
