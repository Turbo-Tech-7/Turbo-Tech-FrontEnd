import { useState } from "react";

export const useFetch = (baseUrl) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const httpConfig = async (
    method,
    route,
    bodyData = null,
    queryParams = null,
    id = null
  ) => {
    setLoading(true);
    setError(null);

    let url = id ? `${baseUrl}/${route}/${id}` : `${baseUrl}/${route}`;

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url += `?${searchParams.toString()}`;
    }


    const token = sessionStorage.getItem("token");

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (bodyData && method !== "GET") {
      options.body = JSON.stringify(bodyData);
    }

    try {
      const res = await fetch(url, options);
      const status = res.status;
      const json = status !== 204 ? await res.json() : null;

      if (!res.ok) {
        throw new Error(`Erro: ${res.status} - ${res.statusText}`);
      }

      setData(json);
      return { data: json, status };

    } catch (err) {
      setError(err.message);
      return { data: null, status: 500 };
    } finally {
      setLoading(false);
    }
  };

  return { data, httpConfig, error, loading };
};