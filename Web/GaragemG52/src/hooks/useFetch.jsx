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
    id = null,
    extraOptions = {} // <- novo
  ) => {
    setLoading(true);
    setError(null);

    let url = id ? `${baseUrl}/${route}/${id}` : `${baseUrl}/${route}`;

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url += `?${searchParams.toString()}`;
    }

    const token = sessionStorage.getItem("token");

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

      let responseData = null;

      if (status !== 204) {
        const contentType = res.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          responseData = await res.json();
        } 
        else if (contentType?.includes("application/pdf")) {
          responseData = await res.blob();
        } 
        else if (contentType?.includes("application/octet-stream")) {
          responseData = await res.blob();
        } 
        else {
          responseData = await res.text();
        }
      }

      if (!res.ok) {
        throw new Error(`Erro: ${res.status} - ${res.statusText}`);
      }

      setData(responseData);

      return { data: responseData, status };

    } catch (err) {
      setError(err.message);

      return {
        data: null,
        status: 500,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, httpConfig, error, loading };
};