<template>
  <div v-if="job">
    <h2>{{ job.title }}</h2>
    <p>{{ job.description }}</p>
    <p>Salaire: {{ job.salary }}</p>
    <p>Expérience: {{ job.experience }} ans</p>
    <p>Créé le: {{ job.createdAt }}</p>
    <button @click="$emit('edit', job.id)">Modifier</button>
    <button @click="$emit('delete', job.id)">Supprimer</button>
  </div>
</template>

<script>
export default{
  name: 'JobDetail',
  props: ['job']
}
</script>
