export default function StatCard({ stat }) {
  const isPositive = stat.type === 'POSITIVE';

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              isPositive ? 'bg-green-100' : 'bg-blue-100'
            }`}
          >
            {stat.icon}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{stat.name}</p>
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
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xl font-bold text-orange-600">
            {stat.streak}
          </div>
          <div className="text-xs text-gray-600">
            {stat.streak === 1 ? 'día seguido' : 'días seguidos'}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xl font-bold text-indigo-600">
            {stat.total}
          </div>
          <div className="text-xs text-gray-600">
            {stat.total === 1 ? 'día total' : 'días totales'}
          </div>
        </div>
      </div>
    </div>
  );
}