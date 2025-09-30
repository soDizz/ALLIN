import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

export const createMockRestAPIServer = ({
  api,
  text,
}: {
  api: string;
  text: string;
}) => {
  const restHandler = http.post(api, () => {
    return new HttpResponse(text);
  });

  const server = setupServer(restHandler);
  server.listen();

  return {
    close: () => {
      server.close();
    },
  };
};
