export function verificarEmail(email) {
    if (!email) return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

export function verificarPlacaFormatada(placa) {
    if (!placa) return false;
    const limpa = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    return limpa.length === 7 && regex.test(limpa);
}

export function verificarTelefone(telefone) {
    if (!telefone) return false;

    const limpo = telefone.replace(/\D/g, "");

    return limpo.length >= 10 && limpo.length <= 11;
}

export function senhaValida(senha) {
    return senha && senha.length >= 6;
};

export function senhasIguais(s1, s2) {
    return s1 === s2;
};

export function nomeValido(nome) {
    if (!nome) return false;

    const regex = /^[A-Za-zÀ-ÿ\s]+$/;

    return nome.trim().length >= 3 &&
           regex.test(nome);
}

export function codigoValido(codigo) {
    return /^\d{6}$/.test(codigo);
};

export function verificarCep(cep) {
    if (!cep) return false;
    const limpo = cep.replace(/\D/g, "");
    return limpo.length === 8;
}

export function valorPositivo(valor) {
    const num = parseFloat(valor);
    return !isNaN(num) && num > 0;
}

export function descricaoValida(descricao) {
    return descricao && descricao.trim().length >= 5;
}

