import Card from './Card'

export default function StatCard({ label, value, valueClassName = 'text-text-primary' }) {
  return (
    <Card className="p-6 space-y-2">
      <p className="label-uppercase text-text-secondary">{label}</p>
      <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
    </Card>
  )
}
