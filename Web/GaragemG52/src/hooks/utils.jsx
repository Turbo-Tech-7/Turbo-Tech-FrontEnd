export const utilsJS = () =>{

    // simula função
const utilsJSCongfig = (metodo, dado) => {

    if(metodo === "verificarEmail"){ 
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(dado);
    }

    if(metodo === "verificarPlaca"){
        const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

        var  placaValida = regex.test(dado.toUpperCase());

        if(dado.length !== 7 || !placaValida){
            console.log("Placa Inválida!")
            placaValida = false
        }

        return placaValida
    }
    if(metodo === "verificarTelefone"){
    const telefone = dado.replace(/\D/g, "")

    if(telefone.length < 10 || telefone.length > 11){
        console.log("Telefone de tamanho invalido")
        return false
    }

    return true
}

}
    
      return {utilsJSCongfig};
}