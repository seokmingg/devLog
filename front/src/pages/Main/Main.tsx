import { PeopleRail } from '../../components/feed/PeopleRail'
import { PostCard } from '../../components/feed/PostCard'
import { TechStrip } from '../../components/feed/TechStrip'
import { followers, following, posts, recommendations } from '../../data/mockFeed'
import styles from './Main.module.css'

export function Main() {
  return (
    <main className={styles.layout}>
      <section className={styles.feed} aria-label="게시글 피드">
        <TechStrip />
        {posts.map(post => <PostCard post={post} key={post.id} />)}
        <div className={styles.loading}>◌ 더 많은 게시글을 불러오는 중...</div>
      </section>
      <PeopleRail recommendations={recommendations} following={following} followers={followers} />
    </main>
  )
}
