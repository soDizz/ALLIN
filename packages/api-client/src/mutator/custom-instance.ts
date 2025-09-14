import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

type ApiClientConfig = {
  baseURL: string;
  /**
   * millisecond 단위
   */
  timeout?: number;
  withCredentials?: boolean;
  bearerToken?: string;
};

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig & { axiosInstance?: AxiosInstance },
): Promise<T> => {
  const axiosInstance = options?.axiosInstance ?? axios;

  const promise = axiosInstance({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

export const requestInterceptor = axios.interceptors.request;
export const responseInterceptor = axios.interceptors.response;

let requestInterceptorId: number | null = null;

export const initApiClient = (config: ApiClientConfig) => {
  if (!config.baseURL) {
    console.error(
      '[ApiClient] Error: baseURL must be provided in initApiClient config.',
    );
    // 필요하다면 여기서 에러를 throw하여 baseURL 없이 초기화되는 것을 막을 수 있습니다.
    // throw new Error('[ApiClient] Error: baseURL must be provided in initApiClient config.');
  }
  axios.defaults.baseURL = config.baseURL;
  axios.defaults.timeout = config.timeout;
  axios.defaults.withCredentials = config.withCredentials;
  axios.defaults.headers.common.Authorization = `Bearer ${config.bearerToken}`;

  // 기존 interceptor가 있으면 제거
  if (requestInterceptorId !== null) {
    axios.interceptors.request.eject(requestInterceptorId);
  }

  // 새로운 interceptor 추가하고 ID 저장
  requestInterceptorId = axios.interceptors.request.use(
    _config => {
      if (!axios.defaults.baseURL) {
        return Promise.reject(
          new Error('[ApiClient] Error: baseURL is not set'),
        );
      }
      return _config;
    },
    error => Promise.reject(error),
  );
};
