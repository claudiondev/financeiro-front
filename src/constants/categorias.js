import { Utensils, Car, Home, Music, HeartPulse, GraduationCap, MoreHorizontal } from 'lucide-react'

/**
 * Fonte única de verdade para categoria de gasto: rótulo em português, ícone,
 * classe de badge (Tailwind) e cor hexadecimal (para os gráficos Recharts,
 * que não entendem classes Tailwind). Espelha o enum CategoriaGasto do backend.
 */
export const CATEGORIAS = [
  { valor: 'ALIMENTACAO', rotulo: 'Alimentação', badge: 'badge-orange', hex: '#F97316', icone: Utensils },
  { valor: 'TRANSPORTE', rotulo: 'Transporte', badge: 'badge-blue', hex: '#3B82F6', icone: Car },
  { valor: 'MORADIA', rotulo: 'Moradia', badge: 'badge-purple', hex: '#A855F7', icone: Home },
  { valor: 'LAZER', rotulo: 'Lazer', badge: 'badge-pink', hex: '#EC4899', icone: Music },
  { valor: 'SAUDE', rotulo: 'Saúde', badge: 'badge-cyan', hex: '#06B6D4', icone: HeartPulse },
  { valor: 'EDUCACAO', rotulo: 'Educação', badge: 'badge-green', hex: '#16A34A', icone: GraduationCap },
  { valor: 'OUTROS', rotulo: 'Outros', badge: 'text-secondary', hex: '#64748B', icone: MoreHorizontal },
]

export function categoriaPorValor(valor) {
  return CATEGORIAS.find((c) => c.valor === valor)
}

export function rotuloCategoria(valor) {
  return categoriaPorValor(valor)?.rotulo || valor
}

export function corHexCategoria(valor) {
  return categoriaPorValor(valor)?.hex || '#64748B'
}
