<template>
  <div class="event-card">
    <img :src="event.imageUrl" class="event-img" />
    <div class="event-info">
      <h3>{{ event.title }}</h3>
      <p>{{ event.description }}</p>
      <p class="event-date">{{ new Date(event.date).toLocaleString() }}</p>
      <div class="votes">
        <button @click="$emit('vote', event.id, 'yes')">Yes {{ event.yesVotes }}</button>
        <button @click="$emit('vote', event.id, 'no')">No {{ event.noVotes }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default { props: { event: Object } };
</script>

<style scoped>
.event-card {
  display: flex;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  margin: 20px auto;
  overflow: hidden;
  width: 100%;
  max-width: 900px;  
  transition: transform 0.3s;
}



.event-card:hover { transform: translateY(-5px); }
.event-img { width: 200px; height: 150px; object-fit: cover; }
.event-info { padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.event-info h3 { margin-bottom: 10px; color: #2da0a8; }
.event-date { font-size: 12px; color: #555; margin-bottom: 10px; }
.votes button {
  background: linear-gradient(to right, #5c6bc0, #2da0a8);
  border: none; color: white; padding: 10px 25px;
  margin-right: 10px; border-radius: 8px; cursor: pointer; font-weight: 500;
}
.votes button:hover { opacity: 0.9; }
</style>
