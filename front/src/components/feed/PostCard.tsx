import {useState} from 'react'
import type {Post} from '../../types/feed'
import {Avatar} from '../common/Avatar'
import styles from './PostCard.module.css'

const code = `@Service
public class DevLogService {

    public void create(DevLog log) {
        if (log.getTitle() == null ||
            log.getTitle().isBlank()) {
            throw new IllegalArgumentException(
                "제목은 필수입니다."
            );
        }

        logRepository.save(log);
    }
}`

export function PostCard({post}: { post: Post }) {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const likeCount = (post.likes ?? 0) + (liked ? 1 : 0)

    return <article className={styles.card}>
        <header className={styles.header}>
            <div className={styles.author}><Avatar initials={post.author.initials} tone={post.author.tone}/>
                <div><strong>{post.author.name}</strong><span>{post.createdAt}</span></div>
            </div>
            <button className={styles.more} aria-label="더 보기">•••</button>
        </header>

        {post.kind === 'code' ? <pre className={styles.code} aria-label="Java 서비스 코드 예시"><code>{code}</code></pre> :
            <div className={styles.diagram}><h3>Spring Security 흐름 정리</h3>
                <div><span>Request</span><b>→</b><span>Authentication<br/>Filter</span><b>→</b><span>User Details<br/>Service</span><b>↔</b><span>DB</span>
                </div>
            </div>}

        {post.kind === 'code' && <>
            <div className={styles.actions}>
                <div>
                    <button className={liked ? styles.selected : ''} onClick={() => setLiked(value => !value)}
                            aria-label="좋아요">{liked ? '♥' : '♡'}</button>
                    <button aria-label="댓글">◯</button>
                </div>
                <button className={saved ? styles.selected : ''} onClick={() => setSaved(value => !value)}
                        aria-label="저장">{saved ? '▰' : '▱'}</button>
            </div>
            <div className={styles.body}>
                <strong>좋아요 {likeCount}개</strong><p><b>{post.author.name}</b> {post.content}</p>
                <p className={styles.hashtags}>{post.hashtags?.map(tag => `#${tag}`).join(' ')}</p>
                <a href="#댓글" className={styles.muted}>댓글 {post.comments}개 모두 보기</a>
                <div className={styles.comment}><Avatar initials="SM" size="tiny"/><span>댓글 달기...</span><span>☺</span>
                </div>
            </div>
        </>}
    </article>
}
