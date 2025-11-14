<template>
  <div id="app">
    <h1>Gestion des emplois</h1>

    <div class="nav-buttons">
      <button @click="currentView = 'home'">Accueil</button>
      <button @click="currentView = 'add'">Ajouter un emploi</button>
    </div>

    <HomeView v-if="currentView === 'home'" 
              @editJob="editJob"
              @viewJob="viewJob"/>
    <AddJob v-if="currentView === 'add'" @jobAdded="backToHome"/>
    <EditJob v-if="currentView === 'edit'" 
             :jobId="selectedJobId" 
             @jobUpdated="backToHome"/>
    <JobDetail v-if="currentView === 'details'" 
               :job="selectedJob" 
               @edit="$emit('editJob', $event)"
               @delete="deleteJob"/>
  </div>
</template>

<script>
import HomeView from './components/HomeView.vue'
import AddJob from './components/AddJob.vue'
import EditJob from './components/EditJob.vue'
import JobDetail from './components/JobDetail.vue'

export default{
  name: 'App',
  components: { HomeView, AddJob, EditJob, JobDetail },
  data() {
    return {
      currentView: 'home',  // home, add, edit, details
      selectedJobId: null,
      selectedJob: null
    }
  },
  methods:{
    editJob(id){
      this.selectedJobId = id
      this.currentView = 'edit'
    },
    viewJob(job){
      this.selectedJob = job
      this.currentView = 'details'
    },
    deleteJob(id){
      if (confirm('Voulez-vous vraiment supprimer cet emploi ?')) {
        fetch(`http://localhost:3001/jobs/${id}`, { method: 'DELETE' })
          .then(() =>{
            alert('Emploi supprimé !')
            this.currentView = 'home'
          })
          .catch(err => console.log(err))
      }
    },
    backToHome(){
      this.currentView = 'home'
    }
  }
}
</script>

<style>
#app{
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}
h1{
  text-align: center;
  color: #333;
  margin-bottom: 25px;}
.nav-buttons{
  text-align: center;
  margin-bottom: 20px;
}
.nav-buttons button{
  margin: 0 8px;
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}
.nav-buttons button:hover{
  background: #45a049;
}
input, textarea, select{
  width: 100%;
  padding: 8px;
  margin: 6px 0 12px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

form{
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

/* Liste des emplois */
ul{
  list-style: none;
  padding: 0;
}

li{
  background-color: #fff;
  margin-bottom: 12px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* Boutons dans la liste */
li button{
  margin-left: 5px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}

li button.edit{
  background-color: #2196F3;
  color: white;
}
li button.edit:hover{
  background-color: #1976D2;
}

li button.delete{
  background-color: #f44336;
  color: white;
}
li button.delete:hover{
  background-color: #d32f2f;
}
h2{
  margin-bottom: 15px;
  color: #333;
}
</style>
