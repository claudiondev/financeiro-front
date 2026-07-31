import { Banknote, Smartphone, CreditCard, WalletCards } from 'lucide-react'

/**
 * Fonte única de rótulo/ícone por forma de pagamento. Espelha o enum
 * FormaPagamento do backend. Só CARTAO_CREDITO aceita parcelamento.
 */
export const FORMAS_PAGAMENTO = [
  { valor: 'DINHEIRO', rotulo: 'Dinheiro', icone: Banknote },
  { valor: 'PIX', rotulo: 'Pix', icone: Smartphone },
  { valor: 'CARTAO_CREDITO', rotulo: 'Cartão de crédito', icone: CreditCard },
  { valor: 'CARTAO_DEBITO', rotulo: 'Cartão de débito', icone: WalletCards },
]

export const FORMA_QUE_PARCELA = 'CARTAO_CREDITO'

export function rotuloFormaPagamento(valor) {
  return FORMAS_PAGAMENTO.find((f) => f.valor === valor)?.rotulo || '—'
}

export function iconeFormaPagamento(valor) {
  return FORMAS_PAGAMENTO.find((f) => f.valor === valor)?.icone || null
}
