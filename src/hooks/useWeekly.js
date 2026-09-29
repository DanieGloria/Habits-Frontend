import { useState, useEffect, useCallback } from 'react';
import { getWeekly } from '../api/habits';

export function useWeekly() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(null);

  const load = useCallback(async (date) => {
    setLoading(true);
    setError('');

    try {
      const response = await getWeekly(date);
      setData(response);
      setStartDate(response.start_date);
    } catch (err) {
      setError('Error al cargar la semana');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(null); // primera carga: semana actual
  }, [load]);

  // Navegar semanas
  const previousWeek = () => {
    if (!startDate) return;
    const date = new Date(startDate);
    date.setDate(date.getDate() - 7);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    load(`${yyyy}-${mm}-${dd}`);
  };

  const nextWeek = () => {
    if (!startDate) return;
    const date = new Date(startDate);
    date.setDate(date.getDate() + 7);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    load(`${yyyy}-${mm}-${dd}`);
  };

  const goToday = () => load(null);

  // ¿Es la semana actual?
  const isCurrentWeek = (() => {
    if (!startDate) return true;
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // 1 = lunes, 7 = domingo
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek - 1));
    const yyyy = monday.getFullYear();
    const mm = String(monday.getMonth() + 1).padStart(2, '0');
    const dd = String(monday.getDate()).padStart(2, '0');
    return startDate === `${yyyy}-${mm}-${dd}`;
  })();

  return {
    data,
    loading,
    error,
    startDate,
    previousWeek,
    nextWeek,
    goToday,
    isCurrentWeek,
    reload: () => load(startDate),
  };
}