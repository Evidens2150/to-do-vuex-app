export interface ITask {
  id: number;
  title: string;
  completed: boolean;
}

export type TaskStatus = "all" | "active" | "completed";

export interface IFilter {
  value: TaskStatus;
  title: string;
}