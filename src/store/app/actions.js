export const addJob = ({ commit, rootState }, job) => {
  const { jobs } = rootState.app;

  const newJobs = [...jobs, job];

  commit('setJobs', newJobs);
};

export const removeJob = ({ commit, rootState }, jobId) => {
  const { jobs } = rootState.app;

  const newJobs = [...jobs];

  const idx = newJobs.findIndex((job) => job.id === jobId);

  if (idx < 0) return;

  newJobs.splice(idx, 1);

  commit('setJobs', newJobs);
};

export const editJob = ({ commit, rootState }, { jobId, data }) => {
  const { jobs } = rootState.app;

  const newJobs = [...jobs];

  const idx = newJobs.findIndex((job) => job.id === jobId);

  if (idx < 0) return;

  newJobs[idx] = { ...newJobs[idx], ...data };

  commit('setJobs', newJobs);
};

export const getJob = ({ rootState }, jobId) => {
  const { jobs } = rootState.app;

  return jobs.find((job) => job.id === jobId);
};

export const deleteAll = ({ commit }) => {
  commit('setJobs', []);
};
