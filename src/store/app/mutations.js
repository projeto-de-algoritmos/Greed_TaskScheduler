const saveTasksToLocalStorage = (tasks) => {
  localStorage.setItem('TASK_SCHEDULER_tasks', JSON.stringify(tasks));
};

export const setTasks = (state, tasks) => {
  const newTasks = [...tasks];

  saveTasksToLocalStorage(newTasks);

  state.tasks = newTasks;
};
