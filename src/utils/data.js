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
