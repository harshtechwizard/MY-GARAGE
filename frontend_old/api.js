// Shared API helper: timeout, JSON parsing, consistent errors

async function apiRequest(path, { method = "GET", body, token, timeoutMs = 12000, headers = {} } = {}) {
    if (typeof API_URL === "undefined") {
        throw new Error("API_URL is not defined. Ensure config.js is loaded before api.js");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: controller.signal
        });

        let data = null;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (!res.ok) {
            const msg =
                (data && (data.message || data.error)) ||
                `Request failed (${res.status})`;
            const err = new Error(msg);
            err.status = res.status;
            err.data = data;
            throw err;
        }

        return data;
    } finally {
        clearTimeout(timeout);
    }
}

