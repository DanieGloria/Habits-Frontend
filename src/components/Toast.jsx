import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // espera la animación
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: '✓',
      bg: 'bg-green-500',
      iconBg: 'bg-white/20',
    },
    error: {
      icon: '✕',
      bg: 'bg-red-500',
      iconBg: 'bg-white/20',
    },
    info: {
      icon: 'ℹ',
      bg: 'bg-indigo-500',
      iconBg: 'bg-white/20',
    },
    warning: {
      icon: '⚠',
      bg: 'bg-yellow-500',
      iconBg: 'bg-white/20',
    },
  };

  const style = config[type] || config.success;

  return (
    <div
      className={`fixed bottom-6 right-6 ${style.bg} text-white pl-3 pr-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center font-bold text-lg`}
      >
        {style.icon}
      </div>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 opacity-70 hover:opacity-100 transition text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
}