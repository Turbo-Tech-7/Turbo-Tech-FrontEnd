import { createContext } from "react";

export const OrcamentoContext = createContext()

export function OrcamentoProveider ({children}){
    
    
    
    
    return(
        <OrcamentoContext.Provider value={}>
            {children}
        </OrcamentoContext.Provider>
    )
}