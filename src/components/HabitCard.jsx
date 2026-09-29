export default function HabitCard({ habit, completed, onToggle, onDelete }) {
  const isPositive = habit.type === 'POSITIVE';

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-sm border-2 transition ${
        completed
          ? isPositive
            ? 'bg-green-50 border-green-400'
            : 'bg-blue-50 border-blue-400'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition ${
            completed
              ? isPositive
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={completed ? 'Marcar como no hecho' : 'Marcar como hecho'}
        >
          {completed ? '✓' : habit.icon}
        </button>

        <div>
          <p className="font-semibold text-gray-800">{habit.name}</p>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isPositive ? 'Positivo' : 'Negativo'}
          </span>
        </div>
      </div>

      {!habit.is_global && (
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 transition p-2"
          title="Eliminar hábito"
        >
          🗑️
        </button>
      )}
    </div>
  );
}