import { createContext } from "react";

export const ClienteContext = createContext()

export function ClienteContextProvider ({children}){
    return(
        <ClienteContext.Provider value={}>
            {children}
        </ClienteContext.Provider>
    )
}