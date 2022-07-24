export const addTask = ({ commit, rootState }, task) => {
  const { tasks } = rootState.app;

  const newTasks = [...tasks, task];

  commit('setTasks', newTasks);
};

export const removeTask = ({ commit, rootState }, taskId) => {
  const { tasks } = rootState.app;

  const newTasks = [...tasks];

  const idx = newTasks.findIndex((task) => task.id === taskId);

  if (idx < 0) return;

  newTasks.splice(idx, 1);

  commit('setTasks', newTasks);
};

export const editTask = ({ commit, rootState }, { taskId, data }) => {
  const { tasks } = rootState.app;

  const newTasks = [...tasks];

  const idx = newTasks.findIndex((task) => task.id === taskId);

  if (idx < 0) return;

  newTasks[idx] = { ...newTasks[idx], ...data };

  commit('setTasks', newTasks);
};

export const getTask = ({ rootState }, taskId) => {
  const { tasks } = rootState.app;

  return tasks.find((task) => task.id === taskId);
};

export const deleteAll = ({ commit }) => {
  commit('setTasks', []);
};
