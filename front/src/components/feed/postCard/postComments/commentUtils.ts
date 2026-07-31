const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatRelativeTime(createdAt: string, now = new Date()): string {
    const createdDate = new Date(createdAt)

    if (Number.isNaN(createdDate.getTime())) {
        return createdAt
    }

    const elapsed = Math.max(0, now.getTime() - createdDate.getTime())

    if (elapsed < MINUTE) return '방금 전'
    if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`
    if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}시간 전`
    if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}일 전`

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(createdDate)
}
