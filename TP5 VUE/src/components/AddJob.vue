<template>
  <div>
    <h2>Ajouter un emploi</h2>
    <form @submit.prevent="addJob">
      <input type="text" placeholder="Titre" v-model="title" required>
      <textarea placeholder="Description" v-model="description" required></textarea>
      <input type="number" placeholder="Salaire" v-model="salary" required>
      <input type="number" placeholder="Année d'expérience" v-model="experience" required>
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>
<script>
export default{
  name: 'AddJob',
  data(){
    return{
      title: '',
      description: '',
      salary: null,
      experience: null
    }
  },
  methods:{
    addJob(){
      const newJob ={
        title: this.title,
        description: this.description,
        salary: this.salary,
        experience: this.experience,
        createdAt: new Date().toISOString().split('T')[0]
      }
      fetch('http://localhost:3001/jobs',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      })
        .then(() =>{
          alert('Emploi ajouté !')
          this.$emit('jobAdded')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>
