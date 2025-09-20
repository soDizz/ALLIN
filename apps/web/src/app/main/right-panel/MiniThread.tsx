import { Badge } from '@/components/ui/badge';
import type { MyMessage } from '../chat/Chat';
import { MemoizedUserMessage } from '../chat/memoized-user-message';

type MiniThreadProps = {
  thread: [MyMessage, MyMessage];
};

export const MiniThread = ({ thread }: MiniThreadProps) => {
  return (
    <div className='w-full aspect-4/5 bg-red-100 flex flex-col gap-1 p-1'>
      <Badge className='text-xs ml-2 p-0.5 px-1 rounded-md text-wrap whitespace-pre-wrap break-word max-h-[54px] select-none'>
        {
          '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요'
        }
      </Badge>
      <div className='text-xs p-2 max-h-[100px] overflow-y-hidden select-none'>
        Vitest는 자바스크립트와 타입스크립트 프로젝트에서 사용하는 빠르고 가벼운
        테스팅 프레임워크입니다. 주요 특징을 간단히 설명하면: 빠른 속도: Vite
        기반으로 작동하기 때문에 테스트 실행 속도가 매우 빠릅니다. 유연성:
        Jest와 비슷한 API를 제공해서 Jest 사용자들이 쉽게 적응할 수 있습니다.
        가벼움: 불필요한 설정 없이 간단하게 셋업할 수 있습니다. 현대적 코드
        지원: ES 모듈, 타입스크립트, Vue, React 등 최신 프레임워크와 언어 기능을
        잘 지원합니다. 개발 편의 기능: 테스트 자동 재실행, 소스맵 기반 디버깅,
        병렬 처리 등 개발자 경험을 높여줍니다. 즉, Vitest는 Vite 환경에서 특히
        최적화된 테스트 도구로, 빠르고 쉽게 단위 테스트(unit test)와 통합
        테스트(integration test)를 작성하고 실행할 수 있게 도와줍니다. 필요하면
        Vitest 설치·사용법도 알려줄게요.
      </div>
    </div>
  );
};
