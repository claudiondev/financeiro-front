import Modal from '../Modal'
import Button from './Button'

export default function ConfirmDialog({ isOpen, title = 'Confirmar Exclusão', message, onCancel, onConfirm }) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-text-secondary text-sm">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}
