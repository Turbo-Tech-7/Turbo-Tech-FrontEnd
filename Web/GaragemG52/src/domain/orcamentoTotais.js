export function calcularTotalPecas(Pecas = []) {
    return Pecas.reduce((acc, item) => {
        return acc + ((parseFloat(item.valor) || 0) * (Number(item.quantidade) || 0))
    }, 0)
}

export function calcularTotal(Pecas = [], MaoDeObra = 0) {
    return calcularTotalPecas(Pecas) + (Number(MaoDeObra) || 0)
}
