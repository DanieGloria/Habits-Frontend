import { useState } from 'react';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { useHabits } from '../hooks/useHabits';
import { createHabit, deleteHabit } from '../api/habits';

export default function Dashboard() {
  const { habits, logsByHabit, loading, error, reload, toggleHabit } =
    useHabits();

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  // confirm = { id, name } cuando queremos borrar

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const handleCreate = async (habit) => {
    await createHabit(habit);
    await reload();
    showToast('Hábito creado correctamente', 'success');
  };

  // Pedir confirmación
  const askDelete = (habit) => {
    setConfirm({ id: habit.id, name: habit.name });
  };

  // Confirmar eliminación
  const handleDeleteConfirmed = async () => {
    if (!confirm) return;

    try {
      await deleteHabit(confirm.id);
      await reload();
      showToast(`"${confirm.name}" eliminado`, 'success');
    } catch (err) {
      showToast(
        err.response?.data?.message || 'No se pudo eliminar',
        'error'
      );
    } finally {
      setConfirm(null);
    }
  };

  const positiveHabits = habits.filter((h) => h.type === 'POSITIVE');
  const negativeHabits = habits.filter((h) => h.type === 'NEGATIVE');

  const completedCount = habits.filter(
    (h) => logsByHabit[h.id] === true
  ).length;
  const totalCount = habits.length;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis hábitos</h1>
            <p className="text-gray-500">
              Hoy has completado {completedCount} de {totalCount}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            + Nuevo hábito
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Progreso de hoy
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : habits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-gray-600 mb-4">
              Aún no tienes hábitos. ¡Crea el primero!
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
            >
              Crear mi primer hábito
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Columna hábitos positivos */}
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-green-500">✅</span> Positivos
              </h2>
              <div className="space-y-3">
                {positiveHabits.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">
                    No tienes hábitos positivos
                  </p>
                ) : (
                  positiveHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completed={logsByHabit[habit.id] === true}
                      onToggle={() => toggleHabit(habit.id)}
                      onDelete={() => askDelete(habit)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Columna hábitos negativos */}
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-blue-500">🚫</span> Negativos
              </h2>
              <div className="space-y-3">
                {negativeHabits.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">
                    No tienes hábitos negativos
                  </p>
                ) : (
                  negativeHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completed={logsByHabit[habit.id] === true}
                      onToggle={() => toggleHabit(habit.id)}
                      onDelete={() => askDelete(habit)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateHabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      <ConfirmModal
        isOpen={!!confirm}
        title="Eliminar hábito"
        message={`¿Seguro que quieres eliminar "${confirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirm(null)}
      />

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}