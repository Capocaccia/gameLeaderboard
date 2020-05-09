<template>
  <div class="dashboard">
    <button @click="goBack()">Back</button>
    <canvas class="win-chart" id="firstPlaces"></canvas>
    <canvas class="win-chart" id="secondPlaces"></canvas>
    <canvas class="win-chart" id="thirdPlaces"></canvas>
    <canvas class="win-chart" id="fourthPlaces"></canvas>
  </div>
</template>


<script>
  import app from '../firebaseConfig'
  import Chart from 'chart.js'
  let db = app.database();

export default {
  name: 'Stats',
  data () {
    return {
      winners: null
    }
  },
  mounted() {
    let allWinners = db.ref(`/${this.$route.params.gameName}`)

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
      let firstPlaces = {}
      let secondPlaces = {}
      let thirdPlaces = {}
      let fourthPlaces = {}

      let firstWinners = []
      let secondWinners = []
      let thirdWinners = []
      let fourthWinners = []

      let firstWinCount = []
      let secondWinCount = []
      let thirdWinCount = []
      let fourthWinCount = []

      for(var i = 0; i < this.winners.length; i++) {
        let gameWinners = this.winners[i];

        //builds an obj of all winners and the number of games they have won
        if(gameWinners[0]) {
          firstPlaces[gameWinners[0]] === undefined ? firstPlaces[gameWinners[0]] = 1 : firstPlaces[gameWinners[0]]++
        }

        if(gameWinners[1]) {
          secondPlaces[gameWinners[1]] === undefined ? secondPlaces[gameWinners[1]] = 1 : secondPlaces[gameWinners[1]]++
        }

        if(gameWinners[2]){
          thirdPlaces[gameWinners[2]] === undefined ? thirdPlaces[gameWinners[2]] = 1 : thirdPlaces[gameWinners[2]]++
        }

        if(gameWinners[3]) {
          fourthPlaces[gameWinners[3]] === undefined ? fourthPlaces[gameWinners[3]] = 1 : fourthPlaces[gameWinners[3]]++
        }

      }

      for(var winnerTotal in firstPlaces) {
        firstWinners.push(winnerTotal)
        firstWinCount.push(firstPlaces[winnerTotal])
      }

      for(var winnerTotal in secondPlaces) {
        secondWinners.push(winnerTotal)
        secondWinCount.push(secondPlaces[winnerTotal])
      }

      for(var winnerTotal in thirdPlaces) {
        thirdWinners.push(winnerTotal)
        thirdWinCount.push(thirdPlaces[winnerTotal])
      }

      for(var winnerTotal in fourthPlaces) {
        fourthWinners.push(winnerTotal)
        fourthWinCount.push(fourthPlaces[winnerTotal])
      }


      this.mountFirstPlace([firstWinners, firstWinCount])
      this.mountSecondPlace([secondWinners, secondWinCount])
      this.mountThirdPlace([thirdWinners, thirdWinCount])
      this.mountFourthPlace([fourthWinners, fourthWinCount])
    },
    goBack () {
      this.$router.push({name: "Home"})
    },
    mountFirstPlace (leaderData) {
      let ctx = document.getElementById("firstPlaces");

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
          responsive: true,
          title: {
            display: true,
            text: 'First Place Wins'
          }
        }
      })
    },
    mountSecondPlace (leaderData) {
      let ctx = document.getElementById("secondPlaces");

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
          responsive: true,
          title: {
            display: true,
            text: 'Second Place Wins'
          }
        }
      })
    },
    mountThirdPlace (leaderData) {
      let ctx = document.getElementById("thirdPlaces");

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
          responsive: true,
          title: {
            display: true,
            text: 'Third Place Wins'
          }
        }
      })
    },
    mountFourthPlace (leaderData) {
      let ctx = document.getElementById("fourthPlaces");

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
          responsive: true,
          title: {
            display: true,
            text: 'Fourth Place Wins'
          }
        }
      })
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
