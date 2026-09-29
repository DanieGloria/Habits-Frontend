import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { useStats } from '../hooks/useStats';

export default function Stats() {
  const { stats, loading, error } = useStats();

  const totalStreak = stats.reduce((sum, s) => sum + s.streak, 0);
  const totalDays = stats.reduce((sum, s) => sum + s.total, 0);
  const bestStreak = stats.length > 0 ? Math.max(...stats.map((s) => s.streak)) : 0;

  const positiveStats = stats.filter((s) => s.type === 'POSITIVE');
  const negativeStats = stats.filter((s) => s.type === 'NEGATIVE');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Estadísticas
        </h1>
        <p className="text-gray-500 mb-6">
          Tu progreso con los hábitos
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : stats.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-600 mb-2">
              Aún no tienes estadísticas
            </p>
            <p className="text-sm text-gray-500">
              Marca hábitos como completados para empezar a ver tu progreso
            </p>
          </div>
        ) : (
          <>
            {/* Resumen general */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow p-5 text-white">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-3xl font-bold">{bestStreak}</div>
                <div className="text-sm opacity-90">Mejor racha actual</div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow p-5 text-white">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-3xl font-bold">{totalDays}</div>
                <div className="text-sm opacity-90">Días registrados en total</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow p-5 text-white">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-3xl font-bold">{totalStreak}</div>
                <div className="text-sm opacity-90">Suma de todas las rachas</div>
              </div>
            </div>

            {/* Hábitos positivos */}
            {positiveStats.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">✅</span> Hábitos positivos
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positiveStats.map((stat) => (
                    <StatCard key={stat.habit_id} stat={stat} />
                  ))}
                </div>
              </div>
            )}

            {/* Hábitos negativos */}
            {negativeStats.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">🚫</span> Hábitos negativos
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {negativeStats.map((stat) => (
                    <StatCard key={stat.habit_id} stat={stat} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}