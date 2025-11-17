<template>
  <div>
    <h2>Liste des tâches</h2>

    <div>
      <button v-for="filter in filters"
        :key="filter.value"
        :class="{ active: currentFilter === filter.value }"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <p>Total des tâches : {{ totalTasks }}</p>

    <div v-for="task in filteredTasks" :key="task.id" class="task">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <p>
        Status :
        <span :class="{ completed: task.completed }">
          {{ task.completed ? "Terminée" : "À faire" }}
        </span>
      </p>
      <button v-show="!task.completed" @click="markAsCompleted(task.id)">
        Marquer comme terminée
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import tasksData from "../assets/tasks.json";

const tasks = ref(tasksData);

const filters = [
  { label: "Toutes", value: "all" },
  { label: "À faire", value: "todo" },
  { label: "Terminées", value: "done" },
];

const currentFilter = ref("all");

const filteredTasks = computed(() => {
  if (currentFilter.value === "todo") {
    return tasks.value.filter((t) => !t.completed);
  } else if (currentFilter.value === "done") {
    return tasks.value.filter((t) => t.completed);
  } else {
    return tasks.value;
  }
});

const totalTasks = computed(() => tasks.value.length);

function markAsCompleted(id) {
  const task = tasks.value.find((t) => t.id === id);
  if (task) task.completed = true;
}
</script>

<style scoped>
/* Conteneur principal */
div {
    text-align: center;
  max-width: 600px;
  margin: 40px auto;
  background: #f7f9fb;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(80,148,220,0.08);
}

/* Title */
h2 {
  text-align: center;
  color: #22577a;
  letter-spacing: 1px;
  margin-bottom: 24px;
}

/* Filtres */
button {
  background: #38a3a5;
  color: #fff;
  border: none;
  outline: none;
  margin: 0 10px 20px 0;
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button.active, button:hover {
  background: #22577a;
  color: #fff;
}

p {
  font-size: 1.06rem;
  margin-bottom: 18px;
  color: #22223b;
  text-align: center;
}

/* Card tâche */
.task {
  background: #fff;
  margin-bottom: 22px;
  padding: 18px 22px;
  border-radius: 13px;
  border: 1px solid #c7f9cc;
  box-shadow: 0 2px 8px rgba(50,130,184,0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.task h3 {
  margin-bottom: 4px;
  color: #38a3a5;
  font-size: 1.16rem;
  font-weight: 600;
}
.task p {
  margin-bottom: 8px;
}
.task .completed {
  color: #57cc99;
  font-weight: 600;
}
.task span {
  font-size: 1.01rem;
}

.task button {
  background: #57cc99;
  color: #fff;
  border: none;
  margin-top: 10px;
  padding: 7px 15px;
  border-radius: 7px;
  font-size: 0.97rem;
  cursor: pointer;
  transition: background 0.2s;
}
.task button:hover {
  background: #22577a;
}
</style>
