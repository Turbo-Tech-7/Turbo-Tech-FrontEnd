import { useCallback, useState } from "react";
import { getApiBaseUrl } from "../config/api";
import { getAuthToken } from "../services/authStorage";

const responseStrategies = [
  { matches: (contentType) => contentType?.includes("application/json"), parse: (response) => response.json() },
  { matches: (contentType) => contentType?.includes("application/pdf"), parse: (response) => response.blob() },
  { matches: (contentType) => contentType?.includes("application/octet-stream"), parse: (response) => response.blob() },
  { matches: () => true, parse: (response) => response.text() },
]

async function parseResponse(response) {
  if (response.status === 204) return null

  const contentType = response.headers.get("content-type")
  const strategy = responseStrategies.find(({ matches }) => matches(contentType))

  return strategy.parse(response)
}

export const useFetch = (baseUrl = getApiBaseUrl()) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const httpConfig = useCallback(async (
    method,
    route,
    bodyData = null,
    queryParams = null,
    id = null,
    extraOptions = {} 
  ) => {
    setLoading(true);
    setError(null);

    let url = id ? `${baseUrl}/${route}/${id}` : `${baseUrl}/${route}`;

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url += `?${searchParams.toString()}`;
    }

    const token = getAuthToken();

    const headers = {};

    // Só coloca Content-Type se NÃO for FormData
    if (!(bodyData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      ...extraOptions, // <- permite responseType customizado
    };

    if (bodyData && method !== "GET") {
      options.body =
        bodyData instanceof FormData
          ? bodyData
          : JSON.stringify(bodyData);
    }

    try {
      const res = await fetch(url, options);
      const status = res.status;

      const responseData = await parseResponse(res);

      if (!res.ok) {
        setError(responseData);

      return {
        data: null,
        error: responseData,
        status,
      };
      }

      setData(responseData);

      return { 
        data: responseData,
        error: null,
        status,
       };

    } catch (err) {

      console.error("Erro na requisição:", err);

      setError(err.message);

      const errorMessage = err instanceof Error
        ? err.message
        : "Erro inesperado na requisição";

      return {
        data: null,
        error: errorMessage,
        status: null,
      };
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return { data, httpConfig, error, loading };
};