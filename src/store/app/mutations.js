const saveJobsToLocalStorage = (jobs) => {
  localStorage.setItem('JOB_SCHEDULER_jobs', JSON.stringify(jobs));
};

export const setJobs = (state, jobs) => {
  const newJobs = [...jobs];

  saveJobsToLocalStorage(newJobs);

  state.jobs = newJobs;
};
