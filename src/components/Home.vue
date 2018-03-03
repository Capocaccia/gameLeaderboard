<template>
  <div class="dashboard">
    <button class="log-win btn-3d green" @click="logWinner()" v-if="!logWin">Log Win</button>
    <div class="log-winner" v-if="logWin">
      <div>
        <input placeholder="Winners Name" type="text" v-model="name">
      </div>
      <div>
        <button @click="sendToFirebase()">Log Winner</button>
        <button @click="logWin = false">Close</button>
      </div>
    </div>
    <h1 class="top-leader">Current leader is: {{ leader }} with {{ leaderCount }} wins!</h1>
    <h2 class="total-games">Total Games Played: {{ totalGames }}</h2>
    <div class="leaderboard">
      <h2>Leaderboard</h2>
      <div class="winner" v-for="winner in winners">
        <div class="divider"></div>
        <div class="winner-data">
          <div class="winner-name">
            <span class="label">Winner:</span> {{ winner.name }}
          </div>
          <div class="winner-date">
            <span class="label">On:</span> {{ winner.date }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import app from '../firebaseConfig'

  let db = app.database();
  let allWinners = db.ref('/winners')


export default {
  name: 'Home',
  data () {
    return {
      name: '',
      winners: [],
      logWin: false,
      leader: '',
      leaderCount: 0,
      totalGames: 0
    }
  },
  methods: {
    sendToFirebase () {
      let date = new Date
      let payload = {
        name: this.name,
        date: date.toDateString()
      };
      this.logWin = false
      db.ref('/winners').push(payload)
    },
    logWinner () {
      this.logWin = true
    },
    getTopLeader () {
      let obj = {};

      for(var key in this.winners) {
        //builds an obj of all winners and the number of games they have won
        obj[this.winners[key].name] === undefined ? obj[this.winners[key].name] = 1 : obj[this.winners[key].name]++

        //updates total number of games played
        this.totalGames++
      }

      for(var key in obj) {

        //gets the number of wins from the win leader
        this.leaderCount === 0 ? this.leaderCount = obj[key] : obj[key] > this.leaderCount ? this.leaderCount = obj[key] : ''

        //gets the name of the leader
        this.leader = obj[key] === this.leaderCount ? key : this.leader
      }
    }
  },
  mounted(){
    allWinners.on('value', (snapshot) => {
      this.winners = snapshot.val();

      this.getTopLeader()
    })
  }
}
</script>


<style scoped>
.label {
  font-weight: bold;
}

.dashboard {
  background-color: #5CDB95;
  height: 100%;
  padding: 1rem;
}

.top-leader, .total-games {
  color: #EDF5E1;
}

.winner-data {
  padding: 1rem;
}

.leaderboard {
  color: #05386B;
  border: 2px solid #05386B;
  border-radius: 5px;
  width: 80%;
  margin: 0 10%;
  padding: 1rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.leaderboard > h2 {
  color: #EDF5E1;
}
.divider {
  border-top: 1px solid #05386B;
  width: 80%;
  margin: 0 10% 0 10%;
}

.log-winner {
  padding: 1rem;
}

input {
  background-color: #EDF5E1;
  border: none;
  outline: none;
  padding: .5rem;
  margin: 0 1rem 1rem 1rem;
  border-radius: 5px;
}
  
button {
  padding: .5rem 2rem;
  border: none;
  outline: none;
  background-color: #05386B;
  color: #EDF5E1;
  transition: 0.3s;
  font-size: 1rem;
  border-radius: 5px;
}

button:hover {
  color: #8EE4AF;
  cursor: pointer;
}


</style>
