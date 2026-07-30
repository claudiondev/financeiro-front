/**
 * Exibe um valor monetário em fonte mono, dígito a dígito, cada caractere entrando
 * com uma pequena "virada". Quando `valor` muda, só os caracteres que de fato
 * mudaram remontam (key = índice+caractere) — o resto fica parado no lugar,
 * como um contador mecânico que só move as rodas que precisam mudar.
 */
export default function SaldoDisplay({ valor, className = '' }) {
  const texto = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)

  return (
    <span className={`font-mono tabular-nums whitespace-pre ${className}`} aria-label={texto}>
      {texto.split('').map((char, i) => (
        <span key={`${i}-${char}`} className="digito" style={{ '--i': i }}>
          {char}
        </span>
      ))}
    </span>
  )
}
