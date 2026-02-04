export type SplitTime = {
  date: string;
  timeSpent: number;
};
export type GetTimerResponse = {
  timerId: string;
  studyLogId: string;
  splitTimes: SplitTime[];
  startTime: string;
  lastUpdateTime: string;
};

export type StartTimerRequest = {
  todayGoal: string;
  tasks: string[];
};

export type StartTimerResponse = {
  message: string;
  studyLogId: string;
  timerId: string;
  startTime: string;
};

export type DeleteTimerResponse = {
  message: string;
};
