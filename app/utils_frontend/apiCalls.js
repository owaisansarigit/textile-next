const BASE_URL = process.env.API_BASE_URL || "";

const request = async (method, endpoint, { data, params, headers = {}, tokenProvider } = {}) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    const token = tokenProvider?.();
    const res = await fetch(`${BASE_URL}${endpoint}${query}`, {
        method, headers: {
            "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }), ...headers,
        },
        body: data ? JSON.stringify(data) : null,
    });
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        throw {
            status: res.status,
            message: payload?.message || res.statusText,
            data: payload,
        };
    }
    return payload;
};

export const api = {
    get: (e, o) => request("GET", e, o),
    post: (e, d, o) => request("POST", e, { ...o, data: d }),
    put: (e, d, o) => request("PUT", e, { ...o, data: d }),
    delete: (e, o) => request("DELETE", e, o),
};
