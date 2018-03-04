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
          <button @click="removeWinner(winner.key)" v-if="deleteActive">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import app from '../firebaseConfig'

  let db = app.database();
  let allWinners = db.ref('/')


export default {
  name: 'Home',
  data () {
    return {
      name: '',
      winners: [],
      logWin: false,
      leader: '',
      leaderCount: 0,
      totalGames: 0,
      deleteActive: false
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
      db.ref('/').push(payload)
    },
    logWinner () {
      this.logWin = true
    },
    removeWinner (key) {
      db.ref('/' + key).remove()
    },
    getTopLeader () {
      let obj = {};
      this.totalGames = 0

      for(var i = 0; i < this.winners.length; i++) {
        //builds an obj of all winners and the number of games they have won
        obj[this.winners[i].name] === undefined ? obj[this.winners[i].name] = 1 : obj[this.winners[i].name]++

        //updates total number of games played
        this.totalGames++
      }

      for(var key in obj) {

        //gets the number of wins from the win leader
        this.leaderCount === 0 ? this.leaderCount = obj[key] : obj[key] > this.leaderCount ? this.leaderCount = obj[key] : ''

        //gets the name of the leader
        this.leader = obj[key] === this.leaderCount ? key : this.leader
      }
    },
    activateDelete () {
      const code = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightbaEnter';
      let pressed = [];
      window.addEventListener('keyup', (e) => {
        pressed.push(e.key);
        pressed.splice(-code.length - 1, pressed.length - code.length);
        if(pressed.join('') === code){
          this.deleteActive = true
        }
      })
    }
  },
  mounted(){
    allWinners.on('value', (snapshot) => {
      var winnersBank = [];

      snapshot.forEach((childSnap) => {
        let item = childSnap.val()
        item.key = childSnap.key
        winnersBank.push(item)
      })
      this.winners = winnersBank.reverse();
      this.getTopLeader();
      this.activateDelete();
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
