<template>
  <div class="dashboard">
    <button class="log-win btn-3d green" @click="logWinner()" v-if="!logWin">Log Win</button>
    <button @click="goToStats()" v-if="!logWin">More Stats</button>
    <div>
      <h1>Change Game:</h1>
      <select v-model="game" name="game" @change="getWinners()">
        <option v-for="gamename, idx in gameNames" :key="idx" :value='gamename'>{{gamename}}</option>
      </select>
    </div>
    <div class="log-winner" v-if="logWin">
      <div>
        <div>
          <input placeholder="First Place" type="text" v-model="firstPlace">
        </div>
        <div>
          <input placeholder="Second Place" type="text" v-model="secondPlace">
        </div>
        <div>
          <input placeholder="Third Place" type="text" v-model="thirdPlace">
        </div>
        <div>
          <input placeholder="Fourth Place" type="text" v-model="fourthPlace">
        </div>
      </div>
      <div>
        <button @click="sendToFirebase()">Log Winners</button>
        <button @click="logWin = false">Close</button>
      </div>
    </div>
    <h1 class="top-leader">Current leader is: {{ leader }} with {{ leaderCount }} wins!</h1>
    <h2 class="total-games">Total Games Played: {{ totalGames }}</h2>
    <h2 class="total-games">Current Game: {{ this.game }}</h2>
    <div class="leaderboard">
      <button v-if="editActive" @click="editActive = false"> Exit Edit Mode </button>
      <h2>Leaderboard</h2>
      <div class="winner" v-for="winner in winners">
        <div class="divider"></div>
        <div class="winner-data">
          <div class="winner-name" v-if="winner[0]">
            <span class="label">Winner:</span> {{ winner[0] }}
            <div v-if="editActive">
              <input type="text" v-model="updateText">
              <button @click="updateWinner(winner.parentKey, winner.key, 0)">Update</button>
              <button @click="removeWinner(winner.parentKey, winner.key, 0)">Delete</button>
            </div>
          </div>
          <div class="winner-name" v-if="winner[1]">
            <span class="label">Second Place:</span> {{ winner[1] }}
            <div v-if="editActive">
              <input type="text" v-model="updateText">
              <button @click="updateWinner(winner.parentKey, winner.key, 1)">Update</button>
              <button @click="removeWinner(winner.parentKey, winner.key, 1)">Delete</button>
            </div>
          </div>
          <div class="winner-name" v-if="winner[2]">
            <span class="label">Third Place:</span> {{ winner[2] }}
            <div v-if="editActive">
              <input type="text" v-model="updateText">
              <button @click="updateWinner(winner.parentKey, winner.key, 2)">Update</button>
              <button @click="removeWinner(winner.parentKey, winner.key, 2)">Delete</button>
            </div>
          </div>
          <div class="winner-name" v-if="winner[3]">
            <span class="label">Fourth Place:</span> {{ winner[3] }}
            <div v-if="editActive">
              <input type="text" v-model="updateText">
              <button @click="updateWinner(winner.parentKey, winner.key, 3)"> Update</button>
              <button @click="removeWinner(winner.parentKey, winner.key, 3)">Delete</button>
            </div>
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

export default {
  name: 'Home',
  data () {
    return {
      firstPlace: '',
      secondPlace: '',
      thirdPlace: '',
      fourthPlace: '',
      winners: [],
      logWin: false,
      leader: '',
      leaderCount: 0,
      totalGames: 0,
      editActive: false,
      updateText: '',
      game: 'uno',
      gameNames: []
    }
  },
  methods: {
    sendToFirebase () {
      let date = new Date
      let winnersKey = db.ref(`/${this.game}/`).push().key
      let payload = {
        games: {

          }
        }

      let winners = {}

      this.firstPlace !== '' ? winners[0] = this.firstPlace: ''
      this.secondPlace !== '' ? winners[1] = this.secondPlace: ''
      this.thirdPlace !== '' ? winners[2] = this.thirdPlace: ''
      this.fourthPlace !== '' ? winners[3] = this.fourthPlace: '' 

      this.logWin = false

      //sets the data structure
      db.ref(`/${this.game}/${winnersKey}/date`).push(payload)

      //sets the date
      db.ref(`/${this.game}/${winnersKey}/date`).set({
        date: date.toDateString()
      })

      // //adds the winners
      db.ref(`/${this.game}/${winnersKey}/games`).push(winners)

      this.firstPlace = ''
      this.secondPlace = ''
      this.thirdPlace = ''
      this.fourthPlace = ''
    },
    logWinner () {
      this.logWin = true
    },
    removeWinner (parentKey, key, idx) {
      db.ref(`/${parentKey}/games/${key}/${idx}`).remove()
    },
    updateWinner (date, key, idx) {
      let winnersKey = date.split(' ').join('')

      let update = {}

      update[`/${winnersKey}/games/${key}/${idx}`] = this.updateText;
      db.ref().update(update)
    },
    getTopLeader () {
      this.leader = 'No Data Available'
      this.totalGames = 0
      this.leaderCount = 0
      let obj = {};
      let winners = [];

      for(var i = 0; i < this.winners.length; i++) {
        let gameWinners = this.winners[i];

        //builds an obj of all winners and the number of games they have won
        obj[gameWinners[0]] === undefined ? obj[gameWinners[0]] = 1 : obj[gameWinners[0]]++

        // //updates total number of games played
        this.totalGames++

      }

      for(let key in obj) {
          //gets the number of wins from the win leader
          this.leaderCount === 0 ? this.leaderCount = obj[key] : obj[key] > this.leaderCount ? this.leaderCount = obj[key] : ''
      }

      for(var key in obj) {

        //gets the name of the leader
        if(obj[key] === this.leaderCount) {
          winners.push(key)
        }

        this.leader = winners.length > 1 ? 'Its a Tie Between ' + winners.join(',') : winners[0]
      }

    },
    activateEdit () {
      const code = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightbaEnter';
      let pressed = [];
      window.addEventListener('keyup', (e) => {
        pressed.push(e.key);
        pressed.splice(-code.length - 1, pressed.length - code.length);
        if(pressed.join('') === code){
          this.editActive = true
        }
      })
    },
    goToStats() {
      this.$router.push({name: 'Stats', params: { gameName: this.game }});
    },
    getGameNames() {
      let games = db.ref(`/`)
      games.on('value', (snapshot) => {
        snapshot.forEach((childSnap) => {
          this.gameNames.push(childSnap.key)
        })
      })
    },
    getWinners() {
      let allWinners = db.ref(`/${this.game}`)

      allWinners.on('value', (snapshot) => {
          var winnersBank = [];

          //builds an array of all the winners in the DB
          snapshot.forEach((childSnap) => {
            let item = childSnap.val();
            let date = item.date.date;
            for(var game in item.games) {
              item.games[game].parentKey = childSnap.key
              item.games[game].key = game
              item.games[game].date = date
              winnersBank.push(item.games[game])
            }
          })

          this.winners = winnersBank.reverse();
          this.activateEdit();
        })
      }
  },
  mounted(){
    this.getWinners();
    this.getGameNames();
  },
  watch: {
    winners: function () {
      this.getTopLeader()
    }
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

.winner-name {
  display: flex;
  flex-direction: column;
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
