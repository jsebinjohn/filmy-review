// Fetch that retries on transient failures (network errors and 5xx responses),
// which TMDB occasionally returns as 502 Bad Gateway.
export const fetchWithRetry = async (url, { retries = 2, backoff = 500 } = {}) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.status >= 500 && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, backoff * (attempt + 1)));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, backoff * (attempt + 1)));
      }
    }
  }

  throw lastError;
};
