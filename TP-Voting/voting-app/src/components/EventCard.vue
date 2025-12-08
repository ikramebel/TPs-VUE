<template>
    <div class="event-card">
        <img :src="event.imageUrl" :alt="event.title" class="event-img" />
        <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-description">{{ event.description }}</p>
            <p class="event-date">📅 {{ new Date(event.date).toLocaleString('fr-FR') }}</p>

            <!-- Prix / Gratuit -->
            <p class="event-price">
                {{ event.isFree ? '✅ Gratuit' : `💰 ${event.price} DH` }}
            </p>

            <!-- Message si déjà voté -->
            <div v-if="hasVoted" class="voted-message">
                ✅ Vous avez voté : <strong>{{ hasVoted === 'yes' ? 'YES' : 'NO' }}</strong>
            </div>

            <!-- Boutons de vote -->
            <div v-else class="votes">
                <button @click="$emit('vote', event.id, 'yes')" class="btn-yes">
                    Yes ({{ event.yesVotes || 0 }})
                </button>
                <button @click="$emit('vote', event.id, 'no')" class="btn-no">
                    No ({{ event.noVotes || 0 }})
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EventCard',
    props: {
        event: {
            type: Object,
            required: true
        },
        hasVoted: {
            type: [String, Boolean],
            default: false
        }
    },
    emits: ['vote']
};
</script>

<style scoped>
.event-card {
    display: flex;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    margin: 20px auto;
    overflow: hidden;
    width: 100%;
    max-width: 900px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.event-img {
    width: 250px;
    height: 200px;
    object-fit: cover;
}

.event-info {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.event-info h3 {
    margin-bottom: 10px;
    color: #2da0a8;
    font-size: 1.5em;
}

.event-description {
    color: #555;
    margin-bottom: 10px;
    line-height: 1.5;
}

.event-date {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
    font-weight: 500;
}

.event-price {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 600;
}

.voted-message {
    background: #e8f5e9;
    color: #2e7d32;
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    border: 2px solid #4caf50;
}

.votes {
    display: flex;
    gap: 10px;
}

.votes button {
    flex: 1;
    border: none;
    color: white;
    padding: 12px 25px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s;
}

.btn-yes {
    background: linear-gradient(135deg, #4caf50, #66bb6a);
}

.btn-yes:hover {
    background: linear-gradient(135deg, #66bb6a, #4caf50);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-no {
    background: linear-gradient(135deg, #f44336, #e57373);
}

.btn-no:hover {
    background: linear-gradient(135deg, #e57373, #f44336);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.votes button:active {
    transform: scale(0.98);
}

/* Responsive pour mobile */
@media (max-width: 768px) {
    .event-card {
        flex-direction: column;
        max-width: 100%;
    }

    .event-img {
        width: 100%;
        height: 180px;
    }

    .event-info {
        padding: 15px;
    }

    .event-info h3 {
        font-size: 1.3em;
    }

    .votes {
        flex-direction: row;
    }
}

@media (max-width: 480px) {
    .votes {
        flex-direction: column;
    }

    .votes button {
        width: 100%;
    }
}
</style>