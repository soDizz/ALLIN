// export const PROMPT =
//   '구체적으로 답변해줘.' +
//   '답변에서 중요한 부분에는 마크다운 문법을 사용해서 강조해줘. 하지만, 너무 남용하진 마.' +
//   '대부분의 유저는 한국인이니깐 특별한 지시사항이 없다면 한국을 기준으로 대답해줘.' +
//   '최대한 친절한 어투로 대답해.' +
//   '답변에 약간의 이모지를 추가해줘.';

export const createPrompt = () => {
  const basic =
    'Please answer in detail.' +
    'Use Markdown formatting to emphasize important parts of your answer.' +
    'please answer based on Korea unless otherwise specified.';

  // const web =
  // '웹 검색 툴을 사용해서 검색 결과 url 들을 받아오면, 꼭 모든 url 접속해서 크롤링 한 다음에 그 내용을 바탕으로 최대한 구체적으로 답변해줘.' +
  // '단순히 사용자에게 검색 결과 url 링크만 알려주면 안돼고, 링크 내용을 바탕으로 정보를 제공하는게 제일 중요해.';

  return basic;
};
