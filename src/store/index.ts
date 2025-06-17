import { createStore } from "vuex";
import type { ITask } from "@/types/index";
import { api } from "@/api/index";

interface State {
  isLoading: boolean;
  tasks: ITask[];
}

export default createStore<State>({
  state() {
    return {
      isLoading: false,
      tasks: [],
    };
  },
  
  mutations: {
    setTasks(state, tasks: ITask[]) {
      state.tasks = tasks;
    },
    addTask(state, task: ITask) {
      state.tasks.push(task);
    },
    deleteTask(state, id: number) {
      state.tasks = state.tasks.filter(t => t.id !== id);
    },
    updateTask(state, updatedTask: ITask) {
      const index = state.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    toggleLoading(state, value: boolean) {
      state.isLoading = value;
    }
  },

  actions: {
    async fetchTasks({ commit }) {
      commit('toggleLoading', true);
      const tasks = await api.getTasks();
      commit('setTasks', tasks);
      commit('toggleLoading', false);
    },

    async addTask({ commit }, title: string) {
      commit('toggleLoading', true);
      const task = await api.addTask(title);
      commit('addTask', task);
      commit('toggleLoading', false);
    },

    async deleteTask({ commit }, id: number) {
      commit('toggleLoading', true);
      await api.deleteTask(id);
      commit('deleteTask', id);
      commit('toggleLoading', false);
    },

    async toggleTaskStatus({ commit, state }, id: number) {
      commit('toggleLoading', true);
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        const updated = { ...task, completed: !task.completed };
        await api.updateTask(updated);
        commit('updateTask', updated);
        commit('toggleLoading', false);
      }
    }
  },

  getters: {
    allTasks(state): ITask[] {
      return state.tasks;
    },
    
    activeTasks(state): ITask[] {
      return state.tasks.filter(t => !t.completed);
    },

    completedTasks(state): ITask[] {
      return state.tasks.filter(t => t.completed);
    }
  }
});