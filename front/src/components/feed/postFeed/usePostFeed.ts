import {useCallback, useEffect, useRef, useState} from 'react'
import {getPost, getPosts} from '../../../api/feed/postCard/posts.ts'
import type {PostResponseDto} from '../../../types/feed.ts'

export function usePostFeed() {
    const [feedPosts, setFeedPosts] = useState<PostResponseDto[]>([])
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [hasNext, setHasNext] = useState(true)
    const [initialLoading, setInitialLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [feedError, setFeedError] = useState<string | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const loadingMoreRef = useRef(false)

    const refreshPost = async (postId: number) => {
        const updatedPost = await getPost(postId)

        setFeedPosts(current => current.map(post =>
            post.id === postId ? updatedPost : post
        ))
    }

    const loadMorePosts = useCallback(async () => {
        if (loadingMoreRef.current || !hasNext || nextCursor === null) return

        loadingMoreRef.current = true
        setLoadingMore(true)
        setFeedError(null)

        try {
            const response = await getPosts(nextCursor)

            setFeedPosts(current => {
                const existingIds = new Set(current.map(post => post.id))
                const newPosts = response.content.filter(post => !existingIds.has(post.id))
                return [...current, ...newPosts]
            })

            setNextCursor(response.nextCursor)
            setHasNext(response.hasNext)
        } catch {
            setFeedError('다음 게시글을 불러오지 못했습니다.')
        } finally {
            loadingMoreRef.current = false
            setLoadingMore(false)
        }
    }, [hasNext, nextCursor])

    useEffect(() => {
        let active = true

        getPosts()
            .then(response => {
                if (!active) return

                setFeedPosts(response.content)
                setNextCursor(response.nextCursor)
                setHasNext(response.hasNext)
            })
            .catch(() => {
                if (active) {
                    setFeedError('게시글을 불러오지 못했습니다.')
                }
            })
            .finally(() => {
                if (active) {
                    setInitialLoading(false)
                }
            })

        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        const target = loadMoreRef.current
        if (!target) return

        const observer = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting) {
                void loadMorePosts()
            }
        }, {rootMargin: '300px'})

        observer.observe(target)
        return () => observer.disconnect()
    }, [loadMorePosts])

    return {
        feedPosts,
        initialLoading,
        loadingMore,
        feedError,
        hasNext,
        loadMoreRef,
        refreshPost,
    }
}
