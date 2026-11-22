import type { PortfolioData } from '@/types/portfolio';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** POST to the auth API; returns the raw Response so callers decide how to read it. */
export function postAuth(body: Record<string, unknown>): Promise<Response> {
  return fetch('/api/auth', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

export function getAuthStatus(): Promise<Response> {
  return fetch('/api/auth');
}

export function putPortfolio(data: PortfolioData): Promise<Response> {
  return fetch('/api/portfolio', {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
}
