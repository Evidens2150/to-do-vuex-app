<template>
  <div class="container">
    <h1>Список задач</h1>

    <div class="add-form">
      <input
        v-model="newTitle"
        placeholder="Название задачи"
        class="add-form__input"
      />
      <button
        :title="addTaskButtonTitle"
        :disabled="!newTitle"
        @click="addNewTask"
      >
        +
      </button>
    </div>

    <div class="filters">
      <button
        v-for="filter in filterVariantList"
        :key="filter.value"
        class="filters-item"
        :class="{ 'filters-item--active': currentFilter === filter.value }"
        @click="setFilter(filter.value)"
      >
        {{ filter.title }}
      </button>
    </div>

    <ul class="task-list">
      <li
        v-if="isTaskListEmpty"
        class="task-list__empty"
      >
        Список задач пуст
      </li>
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleStatus(task.id)"
        />

        <span
          class="task-item__status"
          :class="{ 'task-item__status--complete': task.completed }"
        >
          {{ task.title }}
        </span>

        <button
          class="task-item__button"
          @click="deleteThis(task.id)"
        >
          Удалить
        </button>
      </li>
    </ul>
    <loader-component :loading="isLoading"/>
  </div>
</template>

<script setup lang="ts">
// Modules
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
// Components
import LoaderComponent from "@/components/LoaderComponent.vue";
// Types
import {
  ITask,
  TaskStatus,
  IFilter,
} from "@/types/index";

// Data
const store = useStore();
const newTitle = ref<string>("");
const currentFilter = ref<TaskStatus>("all");
const filterVariantList: IFilter[] = [
  {
    value: 'all',
    title: 'Все',
  },
  {
    value: 'active',
    title: 'Активные',
  },
  {
    value: 'completed',
    title: 'Выполненные',
  },
]

// Computed
const addTaskButtonTitle = computed((): string => 
  !newTitle.value ? 'Введите название задачи' : 'Добавить задачу'
);

const filteredTasks = computed((): ITask[] => {
  switch (currentFilter.value) {
    case "active":
      return store.getters.activeTasks;
    case "completed":
      return store.getters.completedTasks;
    default:
      return store.getters.allTasks;
  }
});

const isTaskListEmpty = computed((): boolean => !filteredTasks.value.length);

const isLoading = computed((): boolean => store.state.isLoading);

// Methods
const setFilter = (newValue: TaskStatus) => {
  currentFilter.value = newValue;
};

const addNewTask = () => {
  if (newTitle.value.trim()) {
    store.dispatch("addTask", newTitle.value.trim());
    newTitle.value = "";
  }
};

const deleteThis = (id: number) => {
  store.dispatch("deleteTask", id);
};

const toggleStatus = (id: number) => {
  store.dispatch("toggleTaskStatus", id);
};

// Hooks
onMounted(() => {
  store.dispatch("fetchTasks");
});
</script>

<style lang='scss'>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  max-width: 600px;
  min-width: 280px;
  margin: 0 auto;
  padding: 20px;
}

.add-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
}

.add-form__input {
  min-width: 100px;
  flex: 1;
  padding: 8px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
}

.filters-item--active {
  text-decoration: underline;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  list-style: none;
  padding: 0 5px 0 0;
  min-height: 100px;
  overflow: auto;
}

.task-list__empty {
  padding: 0 4px;
  font-weight: bold;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-item .task-item__status--complete {
  text-decoration-line: line-through;
  color: #999;
}

.task-item__button {
  margin-left: auto;
}
</style>
