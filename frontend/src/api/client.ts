export interface ApiError {
  status: number;
  message: string;
  name: 'ApiError';
}

const get = <T>(endpoint: string): Promise<T> => request<T>(endpoint);
const deleteRequest = <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'DELETE' });

export function createApiError(status: number, message: string): ApiError {
  return {
    status,
    message,
    name: 'ApiError',
  };
}

async function request<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL || ''}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw createApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}

function post<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

function patch<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

function upload<T>(endpoint: string, formData: FormData): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    headers: {}, // Let browser set Content-Type for FormData
    body: formData,
  });
}

export const apiClient = {
  get,
  post,
  patch,
  delete: deleteRequest,
  upload,
};