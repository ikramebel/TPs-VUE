<template>
  <div>
    <h2>Modifier l'emploi</h2>
    <form @submit.prevent="updateJob">
      <input type="text" placeholder="Titre" v-model="title" required>
      <textarea placeholder="Description" v-model="description" required></textarea>
      <input type="number" placeholder="Salaire" v-model="salary" required>
      <input type="number" placeholder="Année d'expérience" v-model="experience" required>
      <button type="submit">Modifier</button>
    </form>
  </div>
</template>

<script>
export default{
  name: 'EditJob',
  props: ['jobId'],
  data() {
    return {
      title: '',
      description: '',
      salary: null,
      experience: null
    }
  },
  mounted(){
    fetch(`http://localhost:3001/jobs/${this.jobId}`)
      .then(res => res.json())
      .then(data => {
        this.title = data.title
        this.description = data.description
        this.salary = data.salary
        this.experience = data.experience
      })
      .catch(err => console.log(err))
  },
  methods:{
    updateJob(){
      const updatedJob ={
        title: this.title,
        description: this.description,
        salary: this.salary,
        experience: this.experience
      }
      fetch(`http://localhost:3001/jobs/${this.jobId}`,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
      })
        .then(() => {
          alert('Emploi modifié !')
          this.$emit('jobUpdated')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>
