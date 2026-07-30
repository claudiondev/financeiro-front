import ilustracaoVazio from '../../assets/ilustracao-vazio.png'

export default function EmptyState({ message, className = '' }) {
  return (
    <div className={`flex flex-col items-center text-center py-8 ${className}`}>
      <img src={ilustracaoVazio} alt="" className="w-24 h-auto opacity-35 mb-3" aria-hidden="true" />
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}
