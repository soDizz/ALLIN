'use client';

import {
  ALLIN_API_BASE_URL,
  ALLIN_API_BASE_URL_LOCAL,
  ApiAgent,
} from '@allin/api-client';
import { useLayoutEffect } from 'react';

export const ApiInitializer = () => {
  useLayoutEffect(() => {
    ApiAgent.getInstance().setBaseUrl(
      process.env.NODE_ENV === 'development'
        ? ALLIN_API_BASE_URL_LOCAL
        : ALLIN_API_BASE_URL,
    );
  }, []);

  return null;
};
