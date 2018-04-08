<template>
  <div class="dashboard">
    <button @click="goBack()">Back</button>
    <canvas class="win-chart" id="winDistribution"></canvas>
  </div>
</template>


<script>
  import app from '../firebaseConfig'
  import Chart from 'chart.js'
  let db = app.database();
  let allWinners = db.ref('/')

export default {
  name: 'Stats',
  data () {
    return {
      winners: null
    }
  },
  mounted() {
    let leaderData
    allWinners.on('value', (snapshot) => {
      var winnersBank = [];


      //builds an array of all the winners in the DB
      snapshot.forEach((childSnap) => {
        let item = childSnap.val();

        for(var game in item.games) {
          winnersBank.push(item.games[game])
        }
      })
      this.winners = winnersBank.reverse()

      this.getLeaderData()
    })

  },
  methods: {
    getLeaderData () {
      let obj = {};
      this.totalGames = 0
      let winners = [];
      let winCount = []

      for(var i = 0; i < this.winners.length; i++) {
        let gameWinners = this.winners[i]; 

        //builds an obj of all winners and the number of games they have won
        obj[gameWinners[0]] === undefined ? obj[gameWinners[0]] = 1 : obj[gameWinners[0]]++
      }

      for(var winnerTotal in obj) {
        winners.push(winnerTotal)
        winCount.push(obj[winnerTotal])
      }

      this.mountChart([winners, winCount])
    },
    goBack () {
      this.$router.push({name: "Home"})
    },
    mountChart (leaderData) {
      let ctx = document.getElementById("winDistribution");

      let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: leaderData[0],
          datasets: [{
            label: 'Number of Wins',
            data: leaderData[1],
            backgroundColor: ['#0080ff', '#ffb347', '#ff6961', '#b19dc9']
          }]
        },
        options: {
          responsive: true
        }
      });
    }
  }
}
</script>

<style scoped>

.dashboard {
  background-color: #5CDB95;
  height: 100%;
  padding: 1rem;
}

.leaderboard > h2 {
  color: #EDF5E1;
}

.win-chart {

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
