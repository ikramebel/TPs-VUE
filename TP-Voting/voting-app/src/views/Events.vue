<template>
  <div class="container">
    <h1>Liste des événements</h1>

    <p v-if="loading">Chargement...</p>
    <p v-else-if="events.length === 0">Aucun événement trouvé.</p>

    <div v-else>
      <EventCard
        v-for="ev in events"
        :key="ev.id"
        :event="ev"
        :userId="userId"
        @vote="handleVote"
      />
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc
} from "firebase/firestore";

import EventCard from "../components/EventCard.vue";

export default {
  name: "EventsPage",
  components: { EventCard },

  data() {
    return {
      events: [],
      loading: true,
      userId: null
    };
  },

  async mounted() {
    const user = auth.currentUser;
    if (!user) {
      this.$router.push("/login");
      return;
    }

    this.userId = user.uid;

    const eventsRef = collection(db, "events");

    onSnapshot(eventsRef, (snapshot) => {
      this.events = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),

        date: docItem.data().date
          ? docItem.data().date.toDate()
          : new Date()
      }));

      this.loading = false;
    });
  },

  methods: {
    async handleVote(eventId, voteType) {
      try {
        const voteDocRef = doc(db, "Votes", `${this.userId}_${eventId}`);
        const eventDocRef = doc(db, "events", eventId);

        const voteSnap = await getDoc(voteDocRef);

        if (voteSnap.exists()) {
          alert("Vous avez déjà voté pour cet événement.");
          return;
        }

        await setDoc(voteDocRef, {
          eventId,
          userId: this.userId,
          vote: voteType,
          createdAt: new Date()
        });

        const field = voteType === "yes" ? "yesVotes" : "noVotes";
        await updateDoc(eventDocRef, {
          [field]: increment(1)
        });

      } catch (error) {
        console.error("Erreur lors du vote :", error);
        alert("Une erreur est survenue lors du vote.");
      }
    }
  }
};
</script>

<style>
.container {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
