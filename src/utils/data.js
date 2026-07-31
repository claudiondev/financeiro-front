// Nome legível para o usuário e número para a query string da API
export const MESES = [
  { nome: 'Janeiro', numero: 1 },
  { nome: 'Fevereiro', numero: 2 },
  { nome: 'Março', numero: 3 },
  { nome: 'Abril', numero: 4 },
  { nome: 'Maio', numero: 5 },
  { nome: 'Junho', numero: 6 },
  { nome: 'Julho', numero: 7 },
  { nome: 'Agosto', numero: 8 },
  { nome: 'Setembro', numero: 9 },
  { nome: 'Outubro', numero: 10 },
  { nome: 'Novembro', numero: 11 },
  { nome: 'Dezembro', numero: 12 },
]

export function formatarDataCurta(data) {
  const parsed = new Date(`${data}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return data
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatarDataCompleta(data) {
  const parsed = new Date(`${data}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return data
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
