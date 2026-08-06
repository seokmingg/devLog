import {PeopleRail} from '../../components/feed/peopleRail/PeopleRail.tsx'
import {PostFeed} from '../../components/feed/postFeed/PostFeed.tsx'
import {followers, following, recommendations} from '../../data/mockFeed'
import styles from './Main.module.css'

export function Main() {
    return (
        <main className={styles.layout}>
            <PostFeed/>

            <PeopleRail
                recommendations={recommendations}
                following={following}
                followers={followers}
            />
        </main>
    )
}
