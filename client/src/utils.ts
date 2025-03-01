export const makeCall = async (url, options, token) => {
    return fetch(url, { ...options,
    headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body && {
            'Content-Type': "application/json",
        }),
        Accept: "application/json"
    }})
}