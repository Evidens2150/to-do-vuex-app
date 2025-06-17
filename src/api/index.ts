
import { ITask } from "@/types/index";

let tasks: ITask[] = [
  { id: 1, title: 'Задача 1', completed: false },
  { id: 2, title: 'Задача 2', completed: true },
];

function delay<T>(ms: number, result: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export const api = {
  getTasks(): Promise<ITask[]> {
    return delay(500, [...tasks]);
  },

  addTask(title: string): Promise<ITask> {
    const now = Date.now();
    const newTask: ITask = { id: now, title, completed: false };
    tasks.push(newTask);
    return delay(300, newTask);
  },

  deleteTask(id: number): Promise<void> {
    tasks = tasks.filter(task => task.id !== id);
    return delay(300, undefined);
  },

  updateTask(updatedTask: ITask): Promise<ITask> {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...updatedTask };
    }
    return delay(300, tasks[index]);
  }
};