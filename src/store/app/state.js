const getLocalStorageTasks = () => {
  const strTasks = localStorage.getItem('TASK_SCHEDULER_tasks');

  if (strTasks) {
    try {
      const tasks = JSON.parse(strTasks);

      if (tasks instanceof Array) return tasks;
    } catch {
      return [];
    }
  }

  return [];
};

export default function () {
  return {
    tasks: getLocalStorageTasks(),
  };
}
