import SaldoDisplay from './SaldoDisplay'

const TOM = {
  positive: 'text-accent-300',
  negative: 'text-red-300',
  muted: 'text-primary-200',
}

function Tick({ label, valor, tom = 'muted', seta }) {
  return (
    <div className="flex items-baseline gap-2">
      {seta && <span className={`text-xs ${TOM[tom]}`}>{seta}</span>}
      <span className="label-uppercase text-primary-300">{label}</span>
      <SaldoDisplay valor={valor} className={`text-sm md:text-base font-medium ${TOM[tom]}`} />
    </div>
  )
}

/**
 * Faixa de saldo — o "herói" do app: cabeçalho de extrato, não card de métrica.
 * Fundo navy escuro (único lugar do app que inverte o tema claro de propósito,
 * pra concentrar o impacto visual num só ponto), com sombra profunda pra
 * descolar do fundo claro da página.
 */
export default function LedgerBalance({ saldo, entradas, saidas, maiorGasto, periodo }) {
  const negativo = Number(saldo) < 0

  return (
    <div className="sombra-faixa-saldo rounded-2xl bg-primary-700 px-6 pt-7 pb-8 md:px-10 md:pt-9 md:pb-10">
      <div className="flex items-center justify-between mb-2">
        <span className="label-uppercase text-primary-300">Saldo do mês{periodo ? ` — ${periodo}` : ''}</span>
        {negativo && (
          <span className="label-uppercase text-red-300 flex items-center gap-1">
            <span aria-hidden="true">⚠</span> negativo
          </span>
        )}
      </div>

      <SaldoDisplay
        valor={saldo}
        className="text-4xl md:text-6xl font-semibold text-white leading-none"
      />

      <div className="mt-7 pt-4 border-t border-dashed border-primary-400/50 flex flex-wrap gap-x-10 gap-y-3">
        <Tick label="entradas" valor={entradas} tom="positive" seta="▲" />
        <Tick label="saídas" valor={saidas} tom="negative" seta="▼" />
        {maiorGasto != null && <Tick label="maior lançamento" valor={maiorGasto} tom="muted" />}
      </div>
    </div>
  )
}
