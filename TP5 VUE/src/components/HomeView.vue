<template>
  <div>
    <FilterNav @filter="applyFilter"/>
    
    <ul>
      <li v-for="job in filteredJobs" :key="job.id">
        {{ job.title }} ({{ job.experience }} ans)
        <button @click="$emit('viewJob', job)">Détails</button>
        <button @click="$emit('editJob', job.id)">Modifier</button>
        <button @click="deleteJob(job.id)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>

<script>
import FilterNav from './FilterNav.vue'

export default{
  name: 'HomeView',
  components: { FilterNav },
  data(){
    return{
      jobs: [],
      filteredJobs: []
    }
  },
  mounted(){
    fetch('http://localhost:3001/jobs')
      .then(res => res.json())
      .then(data => {
        this.jobs = data
        this.filteredJobs = data})
      .catch(err => console.log(err))
  },
  methods:{
    applyFilter(term){
      this.filteredJobs = this.jobs.filter(job =>
        job.title.toLowerCase().includes(term.toLowerCase())
      )
    },
    deleteJob(id){
      if (confirm('Voulez-vous vraiment supprimer cet emploi ?')) {
        fetch(`http://localhost:3001/jobs/${id}`, { method: 'DELETE' })
          .then(() => {
            this.jobs = this.jobs.filter(j => j.id !== id)
            this.filteredJobs = this.filteredJobs.filter(j => j.id !== id)
          })
          .catch(err => console.log(err))
      }
    }
  }
}
</script>
