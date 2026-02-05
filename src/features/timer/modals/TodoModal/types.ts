export type TodoModalMode = "start" | "manage" | "stop";

export type Task = {
  id: string;
  content: string;
  isCompleted?: boolean;
};

export type StartBody = {
  todayGoal: string;
  tasks: string[];
};

export const MAX_TASK_LEN = 30;
