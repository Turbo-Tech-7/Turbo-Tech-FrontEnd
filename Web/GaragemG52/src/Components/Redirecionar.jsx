import { useEffect } from "react";
import {useNavigate } from "react-router-dom"

function Redirecionar(prop){
  
const navigate = useNavigate();

function redirecionar(){
  navigate("/"+ prop.link)
}

useEffect(() => {
    setTimeout(redirecionar, 500)
}, [])


    return (
        <div>Redirecionando para {prop.link}</div>
    )
}

export default Redirecionar