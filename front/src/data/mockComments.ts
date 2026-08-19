import type {CommentPageResponseDto, CommentResponseDto} from '../types/feed.ts'

const mockComments = ([
    {
        id: 1,
        authorName: 'spring_han',
        contents: '정리 정말 잘 봤습니다! 코드 흐름을 이해하는 데 도움이 됐어요.',
        createdAt: '2026-07-30T05:55:00Z',
    },
    {
        id: 2,
        authorName: 'frontend_jiyoon',
        contents: '저도 비슷한 기능을 구현하면서 예외 처리를 어디까지 해야 할지 고민했는데, 이 글을 보니 서비스 계층에서 검증하고 사용자에게 보여줄 메시지는 프런트에서 따로 관리하는 방식이 깔끔해 보이네요. 다음 글에서는 테스트 코드 작성 과정도 같이 보여주시면 좋을 것 같아요.',
        createdAt: '2026-07-30T05:48:00Z',
    },
    {
        id: 3,
        authorName: 'java_sujin',
        contents: '혹시 IllegalArgumentException 대신 커스텀 예외를 사용해도 괜찮을까요?',
        createdAt: '2026-07-30T05:40:00Z',
    },
    {
        id: 4,
        authorName: 'dev_kang',
        contents: '실무에서는 로그도 같이 남기면 문제를 추적하기 편했습니다.',
        createdAt: '2026-07-30T05:25:00Z',
    },
    {
        id: 5,
        authorName: 'code_bom',
        contents: '설명이 간결해서 좋네요 👍',
        createdAt: '2026-07-30T05:00:00Z',
    },
    {
        id: 6,
        authorName: 'backend_min',
        contents: '게시글에 나온 방식으로 구현했을 때 요청 값이 null인 경우와 빈 문자열인 경우를 구분해서 응답해야 하는지도 궁금합니다. 프로젝트에 따라 하나의 메시지로 처리해도 될 것 같지만, 클라이언트에서 필드별 오류를 보여줘야 한다면 예외 응답 형식을 조금 더 구조화해야 할 것 같아요.',
        createdAt: '2026-07-30T04:40:00Z',
    },
    {
        id: 7,
        authorName: 'react_lee',
        contents: '프런트 쪽 에러 처리 내용도 기대할게요.',
        createdAt: '2026-07-30T04:00:00Z',
    },
    {
        id: 8,
        authorName: 'study.log',
        contents: '저장하기 전에 제목뿐 아니라 본문 길이도 검증하면 좋을 것 같습니다.',
        createdAt: '2026-07-30T03:30:00Z',
    },
    {
        id: 9,
        authorName: 'dev_jane',
        contents: '좋은 글 감사합니다!',
        createdAt: '2026-07-30T03:00:00Z',
    },
    {
        id: 10,
        authorName: 'clean_code',
        contents: '검증 로직이 계속 늘어나면 별도의 Validator로 분리하는 방법도 생각해볼 수 있겠네요. 서비스가 비즈니스 로직에만 집중할 수 있다는 장점이 있지만, 너무 일찍 분리하면 오히려 코드를 찾아다니기 어려울 수도 있어서 규모를 보고 결정하는 게 좋다고 생각합니다.',
        createdAt: '2026-07-30T02:30:00Z',
    },
    {
        id: 11,
        authorName: 'api_master',
        contents: '두 번째 페이지 댓글입니다. 더 보기가 잘 동작하네요.',
        createdAt: '2026-07-30T02:00:00Z',
    },
    {
        id: 12,
        authorName: 'spring_newbie',
        contents: '초보자도 이해하기 쉬웠습니다.',
        createdAt: '2026-07-30T01:00:00Z',
    },
    {
        id: 13,
        authorName: 'typescript_kim',
        contents: '댓글 페이지네이션 응답에 totalElements나 totalPages도 추가할 예정인가요? 현재 화면에서는 last만 있어도 충분하지만, 나중에 페이지 번호를 직접 이동하거나 전체 댓글 개수를 정확히 갱신하려면 서버 응답에 관련 정보가 있으면 편할 것 같습니다.',
        createdAt: '2026-07-30T00:00:00Z',
    },
    {
        id: 14,
        authorName: 'db_choi',
        contents: 'DB 제약조건도 함께 설정하면 더 안전할 것 같아요.',
        createdAt: '2026-07-29T06:00:00Z',
    },
    {
        id: 15,
        authorName: 'dev_daily',
        contents: '다음 게시글도 기다리겠습니다 🙌',
        createdAt: '2026-07-28T06:00:00Z',
    },
]).map(comment => ({
    ...comment,
    authorProfileImageUrl: null,
    isMine: false,
})) satisfies CommentResponseDto[]

export async function getMockPostComments(
    _postId: number,
    page: number,
    size = 10,
): Promise<CommentPageResponseDto> {
    const start = page * size
    const end = start + size

    return Promise.resolve({
        content: mockComments.slice(start, end),
        number: page,
        last: end >= mockComments.length,
    })
}
