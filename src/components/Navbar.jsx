import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoutConfirmed = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-bold text-gray-800">Hábitos</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              to="/weekly"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Semana
            </Link>
            <Link
              to="/stats"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Estadísticas
            </Link>

            <span className="text-gray-400">|</span>

            <span className="text-gray-700 font-medium">
              Hola, <span className="text-indigo-600">{user?.name}</span>
            </span>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar sesión?"
        confirmText="Sí, salir"
        cancelText="Cancelar"
        variant="warning"
        loading={loading}
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}