export function verificarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export function verificarPlaca(placa) {
    if (!placa) return false;

    const valor = placa.toUpperCase();
    const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

    if (valor.length !== 7 || !regex.test(valor)) {
        console.log("Placa inválida!");
        return false;
    }
    else {
        return true;
    }
};

export function verificarTelefone(telefone) {
    if (!telefone) return false;

    const limpo = telefone.replace(/\D/g, "");

    if (limpo.length < 10 || limpo.length > 11) {
        console.log("Telefone inválido!");
        return false;
    }
    else {
        return true;
    }
};

export function senhaValida(senha) {
    return senha && senha.length >= 6;
};

export function senhasIguais(s1, s2) {
    return s1 === s2;
};

export function nomeValido(nome) {
    return nome && nome.trim().length > 3;
};

export function codigoValido(codigo) {
    return /^\d{6}$/.test(codigo);
};