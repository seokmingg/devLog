import type {Post} from '../../../types/feed.ts'
import {PostActions} from './PostActions.tsx'
import {PostCardContent} from './PostCardContent.tsx'
import {PostCardHeader} from './PostCardHeader.tsx'
import {PostComments} from './postComments/PostComments.tsx'
import styles from './PostCard.module.css'

export function PostCard({post}: { post: Post }) {
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
            <PostActions initialLikeCount={post.likes}/>
            <PostComments postId={post.id} commentCount={post.commentCount}/>
        </article>
    )
}
