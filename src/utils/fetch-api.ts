export type TApiFetchOptionsPost<T> = {
  method: "POST";
  data: T;
};
export type TApiFetchOptionsGet<T> = {
  method: "GET";
  params?: T;
};

export type TApiFetchOptions<T> =
  | TApiFetchOptionsPost<T>
  | TApiFetchOptionsGet<T>;

const API_BASE = ""; // `http://localhost:8000`

export async function apiFetch<T, P>(
  path: string,
  options: TApiFetchOptions<P> = { method: "GET" }
) {
  const url = API_BASE + path;
  const query =
    options.method === "GET" && options.params
      ? `?${new URLSearchParams(options.params)}`
      : "";
  const body =
    options.method === "POST" && options.data
      ? { body: JSON.stringify(options.data) }
      : {};
  const fullUrl = `${url}${query}`;
  const response = await fetch(fullUrl, {
    method: options.method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    ...body,
  });
  const json: T = await response.json();
  return json;
}

export default apiFetch;
