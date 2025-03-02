export const makeCall = async (url: string, options: RequestInit, token: string) => {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body && {
        'Content-Type': 'application/json',
      }),
      Accept: 'application/json',
    },
  });
};
