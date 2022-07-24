const getLocalStorageJobs = () => {
  const strJobs = localStorage.getItem('JOB_SCHEDULER_jobs');

  if (strJobs) {
    try {
      const jobs = JSON.parse(strJobs);

      if (jobs instanceof Array) return jobs;
    } catch {
      return [];
    }
  }

  return [];
};

export default function () {
  return {
    jobs: getLocalStorageJobs(),
  };
}
