import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/css/Redirecionar.css";

function Redirecionar(prop) {
  const navigate = useNavigate();

  function redirecionar() {
    navigate("/" + prop.link);
  }

  useEffect(() => {
    setTimeout(redirecionar, 50-0);
  }, []);

  return (
    <div className="redirect-container">
      <div className="redirect-box">
        <div className="redirect-spinner"></div>
        
        <div className="redirect-content">
          <p className="redirect-text">
            Redirecionando para <span className="redirect-link">{prop.link}</span>
          </p>
          <p className="redirect-subtext">
            Aguarde um instante...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Redirecionar;