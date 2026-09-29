import api from './axios';

export const getHabits = async () => {
  const { data } = await api.get('/habits');
  return data;
};

export const createHabit = async (habit) => {
  const { data } = await api.post('/habits', habit);
  return data;
};

export const deleteHabit = async (id) => {
  const { data } = await api.delete(`/habits/${id}`);
  return data;
};

export const logHabit = async ({ habit_id, date, completed, notes }) => {
  const { data } = await api.post('/habits/log', {
    habit_id,
    date,
    completed,
    notes,
  });
  return data;
};

export const getLogs = async (params = {}) => {
  const { data } = await api.get('/habits/logs', { params });
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/habits/stats');
  return data;
};

export const getWeekly = async (startDate) => {
  const params = startDate ? { start_date: startDate } : {};
  const { data } = await api.get('/habits/weekly', { params });
  return data;
};