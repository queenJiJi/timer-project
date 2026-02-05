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

export type TaskItem = {
  content: string;
  isCompleted: boolean;
};

export type UpdateTasksRequest = {
  tasks: TaskItem[];
};

export type UpdateTasksResponse = {
  success: boolean;
  message: string;
};

export type StopTimerRequest = {
  splitTimes: SplitTime[];
  review: string;
  tasks: TaskItem[];
};

export type StopTimerResponse = {
  message: string;
  totalTime: number;
  endTime: string;
};
