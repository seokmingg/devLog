import { useState } from 'react'
import type { Person } from '../../types/feed'
import { Avatar } from '../common/Avatar'
import styles from './PeopleRail.module.css'

function PersonList({ people, followable = false }: { people: Person[], followable?: boolean }) {
  const [followed, setFollowed] = useState<string[]>([])
  const toggle = (name: string) => setFollowed(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name])
  return <ul className={styles.list}>{people.map(person => <li key={person.name}><div className={styles.person}><Avatar initials={person.initials} size={followable ? 'small' : 'tiny'} tone={person.tone} /><div><strong>{person.name}</strong><span>{person.description}</span></div></div>{followable ? <button className={followed.includes(person.name) ? styles.followed : ''} onClick={() => toggle(person.name)}>{followed.includes(person.name) ? '팔로잉' : '팔로우'}</button> : <span>›</span>}</li>)}</ul>
}

export function PeopleRail({ recommendations, following, followers }: { recommendations: Person[], following: Person[], followers: Person[] }) {
  return <aside className={styles.rail}>
    <section className={styles.card}><Title text="팔로우 추천" /><PersonList people={recommendations} followable /></section>
    <section className={styles.card}><Title text="내 팔로잉" /><PersonList people={following} /></section>
    <section className={styles.card}><Title text="내 팔로워" /><PersonList people={followers} /></section>
  </aside>
}

function Title({ text }: { text: string }) { return <div className={styles.title}><h2>{text}</h2><a href={`#${text}`}>모두 보기</a></div> }
