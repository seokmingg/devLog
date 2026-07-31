import type {Post} from '../../../types/feed.ts'
import styles from './PostCard.module.css'

type PostCardContentProps = Pick<Post, 'title' | 'contents' | 'kind' | 'hashtags'>

export function PostCardContent({title, contents, kind, hashtags}: PostCardContentProps) {
    return (
        <>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.contentScroll}>
                {kind === 'code' ? (
                    <pre className={styles.code} aria-label={`${title} 코드`}>
                        <code>{contents}</code>
                    </pre>
                ) : (
                    <div className={styles.diagram}>
                        <div>
                            <span>Request</span><b>→</b>
                            <span>Authentication<br/>Filter</span><b>→</b>
                            <span>User Details<br/>Service</span><b>↔</b>
                            <span>DB</span>
                        </div>
                    </div>
                )}

                <div className={styles.contentBody}>
                    {kind !== 'code' && <p>{contents}</p>}
                    <p className={styles.hashtags}>{hashtags.map(tag => `#${tag}`).join(' ')}</p>
                </div>
            </div>
        </>
    )
}
