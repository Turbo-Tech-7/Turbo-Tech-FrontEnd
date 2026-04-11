import { useState } from "react";

export const useFetch = (baseUrl) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const httpConfig = async (method, route, bodyData = null, queryParams = null, id = null) => {
    setLoading(true);
    setError(null); // Limpa erros anteriores

    let url = id ? `${baseUrl}/${route}/${id}` : `${baseUrl}/${route}`;

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url += `?${searchParams.toString()}`;
    }

    const options = {
      method,
      headers: { "Content-type": "application/json" },
    };

    if (bodyData && method !== "GET") {
      options.body = JSON.stringify(bodyData);
    }

    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`Erro: ${res.status} - ${res.statusText}`);
      }

      const json = await res.json();
      setData(json);
      return json;

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, httpConfig, error, loading };
};