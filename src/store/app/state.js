export default function () {
  return {
    jobs: [
      {
        id: 'job_1',
        name: 'Job 1',
        duration: 10,
        deadline: new Date('2022-08-23'),
        priority: 1,
        dependencies: ['job_2'],
      },
    ],
  };
}
