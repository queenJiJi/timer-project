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
