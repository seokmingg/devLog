import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getMyPage, updateMyInterests, updateMyProfile} from '../../api/member.ts'
import {getTechnologyTags} from '../../api/tag.ts'
import {useAuth} from '../../auth/useAuth.ts'
import {Avatar} from '../../components/common/Avatar.tsx'
import type {MyPageResponseDto} from '../../types/member.ts'
import type {TechnologyTagDto} from '../../types/tag.ts'
import styles from './MyPage.module.css'

const loginMethodLabels: Record<MyPageResponseDto['loginMethods'][number], string> = {
    LOCAL: '이메일',
    GOOGLE: 'Google',
}

const statusLabels: Record<MyPageResponseDto['status'], string> = {
    ACTIVE: '정상',
    WITHDRAWN: '탈퇴',
    SUSPENDED: '정지',
}

export function MyPage() {
    const navigate = useNavigate()
    const {logout, updateMember, withdraw} = useAuth()
    const [profile, setProfile] = useState<MyPageResponseDto | null>(null)
    const [imageFailed, setImageFailed] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loggingOut, setLoggingOut] = useState(false)
    const [editing, setEditing] = useState(false)
    const [nickname, setNickname] = useState('')
    const [saving, setSaving] = useState(false)
    const [allTags, setAllTags] = useState<TechnologyTagDto[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [editingInterests, setEditingInterests] = useState(false)
    const [savingInterests, setSavingInterests] = useState(false)
    const [withdrawing, setWithdrawing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        Promise.all([getMyPage(), getTechnologyTags()])
            .then(([response, tags]) => {
                if (!active) return
                setProfile(response)
                setNickname(response.nickname)
                setSelectedTagIds(response.interests.map(tag => tag.id))
                setAllTags(tags)
            })
            .catch(() => {
                if (active) setError('내 정보를 불러오지 못했습니다.')
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [])

    const handleLogout = async () => {
        if (loggingOut) return
        setLoggingOut(true)

        try {
            await logout()
        } finally {
            navigate('/login', {replace: true})
        }
    }

    const startEditing = () => {
        if (!profile) return
        setNickname(profile.nickname)
        setError(null)
        setMessage(null)
        setEditing(true)
    }

    const cancelEditing = () => {
        if (profile) setNickname(profile.nickname)
        setError(null)
        setEditing(false)
    }

    const saveProfile = async () => {
        if (!profile || saving) return

        const trimmedNickname = nickname.trim()
        if (trimmedNickname.length < 2 || trimmedNickname.length > 30) {
            setError('닉네임은 2자 이상 30자 이하로 입력해 주세요.')
            return
        }

        setSaving(true)
        setError(null)
        setMessage(null)

        try {
            const updated = await updateMyProfile({nickname: trimmedNickname})
            setProfile(updated)
            setNickname(updated.nickname)
            updateMember({
                id: updated.id,
                email: updated.email,
                nickname: updated.nickname,
                profileImageUrl: updated.profileImageUrl,
                interests: updated.interests,
            })
            setEditing(false)
            setMessage('프로필이 수정되었습니다.')
        } catch {
            setError('프로필을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.')
        } finally {
            setSaving(false)
        }
    }

    const toggleInterest = (tagId: number) => {
        setError(null)
        setSelectedTagIds(current => {
            if (current.includes(tagId)) {
                return current.filter(id => id !== tagId)
            }
            if (current.length >= 5) {
                setError('관심 기술은 최대 5개까지 선택할 수 있습니다.')
                return current
            }
            return [...current, tagId]
        })
    }

    const cancelInterestEditing = () => {
        if (profile) setSelectedTagIds(profile.interests.map(tag => tag.id))
        setError(null)
        setEditingInterests(false)
    }

    const saveInterests = async () => {
        if (!profile || savingInterests) return
        setSavingInterests(true)
        setError(null)
        setMessage(null)

        try {
            const interests = await updateMyInterests({tagIds: selectedTagIds})
            const updated = {...profile, interests}
            setProfile(updated)
            updateMember({
                id: updated.id,
                email: updated.email,
                nickname: updated.nickname,
                profileImageUrl: updated.profileImageUrl,
                interests,
            })
            setEditingInterests(false)
            setMessage('관심 기술이 수정되었습니다.')
        } catch {
            setError('관심 기술을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.')
        } finally {
            setSavingInterests(false)
        }
    }

    const handleWithdraw = async () => {
        if (withdrawing) return

        const confirmed = window.confirm(
            '정말 탈퇴하시겠습니까? 탈퇴 후 이전 계정은 복구할 수 없습니다.',
        )
        if (!confirmed) return

        setWithdrawing(true)
        setError(null)
        setMessage(null)

        try {
            await withdraw()
            navigate('/signup', {replace: true})
        } catch {
            setError('회원탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.')
            setWithdrawing(false)
        }
    }

    if (loading) {
        return <main className={styles.state}>내 정보를 불러오는 중...</main>
    }

    if (!profile) {
        return <main className={styles.state}>{error ?? '내 정보를 찾을 수 없습니다.'}</main>
    }

    const joinedAt = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(profile.createdAt))

    return (
        <main className={styles.page}>
            <section className={styles.card} aria-labelledby="mypage-title">
                <h1 id="mypage-title">내 프로필</h1>

                <div className={styles.identity}>
                    {profile.profileImageUrl && !imageFailed ? (
                        <img
                            className={styles.profileImage}
                            src={profile.profileImageUrl}
                            alt={`${profile.nickname} 프로필`}
                            referrerPolicy="no-referrer"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <Avatar nickname={profile.nickname} size="large"/>
                    )}
                    {editing ? (
                        <label className={styles.nicknameField}>
                            <span>닉네임</span>
                            <input
                                type="text"
                                value={nickname}
                                minLength={2}
                                maxLength={30}
                                autoComplete="nickname"
                                onChange={event => setNickname(event.target.value)}
                            />
                        </label>
                    ) : (
                        <strong>{profile.nickname}</strong>
                    )}
                    <span>{profile.email}</span>
                </div>

                {error && <p className={styles.error} role="alert">{error}</p>}
                {message && <p className={styles.success} role="status">{message}</p>}

                <dl className={styles.details}>
                    <div>
                        <dt>가입 방식</dt>
                        <dd>{profile.loginMethods.map(method => loginMethodLabels[method]).join(', ')}</dd>
                    </div>
                    <div>
                        <dt>가입일</dt>
                        <dd>{joinedAt}</dd>
                    </div>
                    <div>
                        <dt>계정 상태</dt>
                        <dd>{statusLabels[profile.status]}</dd>
                    </div>
                </dl>

                <section className={styles.interests} aria-labelledby="interests-title">
                    <div className={styles.sectionHeading}>
                        <div>
                            <h2 id="interests-title">관심 기술</h2>
                            <p>최대 5개까지 선택할 수 있습니다.</p>
                        </div>
                        <span>{selectedTagIds.length}/5</span>
                    </div>

                    {editingInterests ? (
                        <div className={styles.tagPicker}>
                            {allTags.map(tag => {
                                const selected = selectedTagIds.includes(tag.id)
                                return (
                                    <button
                                        type="button"
                                        className={selected ? styles.selectedTag : undefined}
                                        aria-pressed={selected}
                                        onClick={() => toggleInterest(tag.id)}
                                        key={tag.id}
                                    >
                                        {tag.name}
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <div className={styles.selectedTags}>
                            {profile.interests.length > 0
                                ? profile.interests.map(tag => <span key={tag.id}>{tag.name}</span>)
                                : <p>선택한 관심 기술이 없습니다.</p>}
                        </div>
                    )}

                    <div className={styles.interestActions}>
                        {editingInterests ? (
                            <>
                                <button type="button" disabled={savingInterests} onClick={cancelInterestEditing}>취소</button>
                                <button type="button" className={styles.saveButton} disabled={savingInterests} onClick={saveInterests}>
                                    {savingInterests ? '저장 중...' : '저장'}
                                </button>
                            </>
                        ) : (
                            <button type="button" onClick={() => {
                                setError(null)
                                setMessage(null)
                                setEditingInterests(true)
                            }}>관심 기술 편집</button>
                        )}
                    </div>
                </section>

                <div className={styles.actions}>
                    {editing ? (
                        <>
                            <button type="button" disabled={saving} onClick={cancelEditing}>취소</button>
                            <button type="button" className={styles.saveButton} disabled={saving} onClick={saveProfile}>
                                {saving ? '저장 중...' : '저장'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={startEditing}>프로필 수정</button>
                            <button
                                type="button"
                                className={styles.logoutButton}
                                disabled={loggingOut}
                                onClick={handleLogout}
                            >
                                {loggingOut ? '처리 중...' : '로그아웃'}
                            </button>
                        </>
                    )}
                </div>

                <section className={styles.dangerZone} aria-labelledby="withdraw-title">
                    <div>
                        <h2 id="withdraw-title">회원 탈퇴</h2>
                        <p>모든 기기에서 로그아웃되며 이전 계정은 복구할 수 없습니다. 같은 이메일로 새로 가입할 수 있습니다.</p>
                    </div>
                    <button type="button" disabled={withdrawing} onClick={handleWithdraw}>
                        {withdrawing ? '탈퇴 처리 중...' : '회원 탈퇴'}
                    </button>
                </section>
            </section>
        </main>
    )
}
