<template>
  <div>
    <input type="text" v-model="search" placeholder="Rechercher un emploi" @input="filterJobs"/>
  </div>
</template>

<script>
export default{
  name:'FilterNav',
  data(){
    return { search: '' }
  },
  methods:{
    filterJobs(){
      this.$emit('filter', this.search)
    }
  }
}
</script>
