//hooks
import { useState, useEffect } from "react"

export const useFetch = (url) => {

    // primeiro parametro valor atua, novo valor
    // necessario para mexer com uma variavel durante o código
    // setItemId(100)

    const [itemId, setItemId] = useState(null)
    const [config, setConfig] = useState(null)
    const [method, setMethod] = useState(null)
    const [callFetch, setCallFetch] = useState(false)
    const [error, setError] = useState(null)
    const [data, setdata] = useState(null)


    const httpConfig = async (data, method, route) => {
        
        let options = ""

        if(method === "DELETE"){
            options = {
            method,
            headers: { "Content-type": "application/json" }}    
        
            const res = await fetch(`${url}/${route}/${data}`, method === "GET" ? {} : options);
            return await res.json();
        }

             options = {
                method,
                headers: { "Content-type": "application/json" },
                body: data ? JSON.stringify(data) : null
            };
            
            const res = await fetch(`${url}/${route}`, method === "GET" ? {} : options);
            return await res.json();

    };

  return {data, httpConfig, error};
}

