import Navbar from '../components/Navbar';
import { useWeekly } from '../hooks/useWeekly';

export default function Weekly() {
  const {
    data,
    loading,
    error,
    startDate,
    previousWeek,
    nextWeek,
    goToday,
    isCurrentWeek,
  } = useWeekly();

  const formatDate = (str) => {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getCellStyle = (status, date, isFuture) => {
    if (isFuture) return 'bg-gray-50 text-gray-300';
    if (status === true) return 'bg-green-500 text-white';
    if (status === false) return 'bg-red-400 text-white';
    return 'bg-gray-100 text-gray-400'; // sin registro (día pasado)
  };

  const getCellIcon = (status, isFuture) => {
    if (isFuture) return '·';
    if (status === true) return '✓';
    if (status === false) return '✗';
    return '—';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Vista semanal</h1>
            <p className="text-gray-500">
              {startDate && data && (
                <>
                  Semana del {formatDate(data.start_date)} al {formatDate(data.end_date)}
                </>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={previousWeek}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
            >
              ← Anterior
            </button>
            {!isCurrentWeek && (
              <button
                onClick={goToday}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Hoy
              </button>
            )}
            <button
              onClick={nextWeek}
              disabled={isCurrentWeek}
              className="bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-medium px-4 py-2 rounded-lg transition"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : !data || data.habits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-600">No hay hábitos para mostrar</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-4 p-4 border-b border-gray-100 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-gray-600">Completado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-400 rounded flex items-center justify-center text-white text-xs">✗</div>
                <span className="text-gray-600">No completado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">—</div>
                <span className="text-gray-600">Sin registro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-50 rounded flex items-center justify-center text-gray-300 text-xs">·</div>
                <span className="text-gray-600">Día futuro</span>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 sticky left-0 bg-white z-10 min-w-[200px]">
                      Hábito
                    </th>
                    {data.days.map((day) => {
                      const isToday = day.date === todayStr;
                      return (
                        <th
                          key={day.date}
                          className={`p-2 text-center min-w-[60px] ${
                            isToday ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="text-xs text-gray-500 capitalize">
                            {day.weekday}
                          </div>
                          <div
                            className={`text-sm font-bold ${
                              isToday ? 'text-indigo-600' : 'text-gray-700'
                            }`}
                          >
                            {day.day}
                          </div>
                        </th>
                      );
                    })}
                    <th className="p-3 text-center text-sm font-semibold text-gray-600 min-w-[80px]">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.habits.map((habit) => {
                    const isPositive = habit.type === 'POSITIVE';
                    return (
                      <tr
                        key={habit.habit_id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition"
                      >
                        <td className="p-3 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{habit.icon}</span>
                            <div>
                              <div className="font-medium text-gray-800 text-sm">
                                {habit.name}
                              </div>
                              <span
                                className={`text-xs ${
                                  isPositive ? 'text-green-600' : 'text-blue-600'
                                }`}
                              >
                                {isPositive ? 'Positivo' : 'Negativo'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {data.days.map((day) => {
                          const status = habit.daily[day.date];
                          const isFuture = day.date > todayStr;
                          const isToday = day.date === todayStr;
                          return (
                            <td
                              key={day.date}
                              className={`p-2 text-center ${isToday ? 'bg-indigo-50' : ''}`}
                            >
                              <div
                                className={`w-8 h-8 mx-auto rounded flex items-center justify-center text-sm font-bold ${getCellStyle(
                                  status,
                                  day.date,
                                  isFuture
                                )}`}
                                title={`${habit.name} - ${day.date}: ${
                                  isFuture
                                    ? 'Futuro'
                                    : status === true
                                    ? 'Completado'
                                    : status === false
                                    ? 'No completado'
                                    : 'Sin registro'
                                }`}
                              >
                                {getCellIcon(status, isFuture)}
                              </div>
                            </td>
                          );
                        })}

                        <td className="p-3 text-center">
                          <span
                            className={`font-bold text-sm ${
                              habit.percentage >= 80
                                ? 'text-green-600'
                                : habit.percentage >= 50
                                ? 'text-yellow-600'
                                : 'text-red-500'
                            }`}
                          >
                            {habit.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumen semanal */}
        {!loading && data && data.habits.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Resumen de la semana
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(() => {
                const totalCompleted = data.habits.reduce((sum, h) => sum + h.completed, 0);
                const totalPast = data.habits.reduce((sum, h) => sum + h.total_past, 0);
                const percentage = totalPast > 0 ? Math.round((totalCompleted / totalPast) * 100) : 0;
                const bestHabit = data.habits.reduce((best, h) =>
                  h.percentage > (best?.percentage ?? 0) ? h : best, null
                );

                return (
                  <>
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1">📋</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {data.habits.length}
                      </div>
                      <div className="text-xs text-gray-600">Hábitos</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-2xl font-bold text-green-600">
                        {totalCompleted}
                      </div>
                      <div className="text-xs text-gray-600">Completados</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {percentage}%
                      </div>
                      <div className="text-xs text-gray-600">Cumplimiento</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-sm font-bold text-orange-600 truncate">
                        {bestHabit?.name || '—'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {bestHabit?.percentage || 0}% · Mejor hábito
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}