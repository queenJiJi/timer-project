import { useMutation } from "@tanstack/react-query";
import type { UpdateTasksRequest } from "../api/types";
import { timerAPI } from "../api/api-service";

export default function useUpdateTasksMutation() {
  return useMutation({
    mutationFn: async (vars: {
      studyLogId: string;
      body: UpdateTasksRequest;
    }) => {
      return timerAPI.updateTasks(vars.studyLogId, vars.body);
    },
  });
}
