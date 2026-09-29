import { useState, useEffect, useCallback } from 'react';
import {
  getHabits,
  getLogs,
  logHabit as logHabitApi,
} from '../api/habits';

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [logsByHabit, setLogsByHabit] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener fecha de hoy en formato YYYY-MM-DD (hora local)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [habitsData, logsData] = await Promise.all([
        getHabits(),
        getLogs({ from: todayStr, to: todayStr }),
      ]);

      setHabits(habitsData);

      // Convertir logs a un objeto { habit_id: completed }
      const map = {};
      logsData.forEach((log) => {
        map[log.habit_id] = log.completed;
      });
      setLogsByHabit(map);
    } catch (err) {
      setError('Error al cargar los hábitos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleHabit = async (habitId) => {
    const current = logsByHabit[habitId] ?? false;
    const next = !current;

    // Actualización optimista (se ve instantáneo en UI)
    setLogsByHabit((prev) => ({ ...prev, [habitId]: next }));

    try {
      await logHabitApi({
        habit_id: habitId,
        date: todayStr,
        completed: next,
      });
    } catch (err) {
      // Si falla, revertimos
      setLogsByHabit((prev) => ({ ...prev, [habitId]: current }));
      console.error(err);
    }
  };

  return {
    habits,
    logsByHabit,
    loading,
    error,
    todayStr,
    reload: loadData,
    toggleHabit,
  };
}