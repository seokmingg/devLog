import type { Person, Post } from '../types/feed'

export const posts: Post[] = [
  {
    id: 1,
    title: '오늘은 DevLog 기능 구현을 마무리했다! 💪',
    contents: `@Service
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
}`,
    author: { initials: 'CL', name: 'code_lover', tone: 'blue' },
    createdAt: '2시간 전',
    kind: 'code',
    likes: 124,
    hashtags: ['Spring', 'Java', 'Backend', 'DevLog'],
    commentCount: 100,
  },
  {
    id: 2,
    title: 'Spring Security 흐름 정리',
    contents: 'Request부터 인증 처리와 DB 조회까지의 흐름을 정리했습니다.',
    author: { initials: 'DJ', name: 'dev_jane', tone: 'pink' },
    createdAt: '5시간 전',
    kind: 'diagram',
    likes: 45,
    hashtags: ['SpringSecurity', 'Backend'],
    commentCount: 0,
  },
]

export const recommendations: Person[] = [
  { initials: 'FJ', name: 'frontend_jiyoon', description: '프론트엔드 개발자\nReact, TypeScript', tone: 'pink' },
  { initials: 'JS', name: 'java_sujin', description: '백엔드 개발자\nJava, Spring', tone: 'yellow' },
  { initials: 'DK', name: 'dev_kang', description: '인프라 엔지니어\nAWS, Docker', tone: 'blue' },
]

export const following: Person[] = [
  { initials: 'DJ', name: 'dev_jane', description: '5시간 전 게시글', tone: 'pink' },
  { initials: 'SH', name: 'spring_han', description: '1일 전 게시글', tone: 'blue' },
  { initials: 'CB', name: 'code_bom', description: '2일 전 게시글', tone: 'yellow' },
]

export const followers: Person[] = [
  { initials: 'FJ', name: 'frontend_jiyoon', description: '방금 전 팔로우', tone: 'pink' },
  { initials: 'DK', name: 'dev_kang', description: '3시간 전 팔로우', tone: 'blue' },
  { initials: 'SL', name: 'study.log', description: '1일 전 팔로우', tone: 'yellow' },
]
