import { useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  title = '¿Estás seguro?',
  message = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
  loading = false,
}) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: '⚠️',
      iconBg: 'bg-red-100',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: '⚠️',
      iconBg: 'bg-yellow-100',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'bg-indigo-100',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
  };

  const style = variants[variant] || variants.danger;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}
          >
            {style.icon}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {title}
            </h3>
            {message && (
              <p className="text-gray-600 text-sm">{message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 ${style.button} disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition`}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}