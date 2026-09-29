import { useState } from 'react';

export default function CreateHabitModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '',
    type: 'POSITIVE',
    icon: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onCreate({
        name: form.name,
        type: form.type,
        icon: form.icon || (form.type === 'POSITIVE' ? '✅' : '🚫'),
      });
      setForm({ name: '', type: 'POSITIVE', icon: '' });
      onClose();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0][0] : null;
      setError(firstError || 'Error al crear el hábito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Nuevo hábito
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Ej: Meditar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'POSITIVE' })}
                className={`p-3 rounded-lg border-2 transition text-left ${
                  form.type === 'POSITIVE'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xl mb-1">✅</div>
                <div className="font-semibold text-sm text-gray-800">
                  Positivo
                </div>
                <div className="text-xs text-gray-500">
                  Quiero hacerlo
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'NEGATIVE' })}
                className={`p-3 rounded-lg border-2 transition text-left ${
                  form.type === 'NEGATIVE'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xl mb-1">🚫</div>
                <div className="font-semibold text-sm text-gray-800">
                  Negativo
                </div>
                <div className="text-xs text-gray-500">
                  Quiero evitarlo
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ícono (opcional)
            </label>
            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Ej: 🧘 (déjalo vacío si no sabes)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pega un emoji o déjalo vacío para usar uno por defecto
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Creando...' : 'Crear hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}