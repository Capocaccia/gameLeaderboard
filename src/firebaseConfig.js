import firebase from 'firebase';

var config = {
    apiKey: 'AIzaSyDt7EQc_GVKqPHWGtw_nT6osO63hOB4cIs',
    databaseURL: 'https://unoleaderboard.firebaseio.com/',
    storageBucket: 'unoleaderboard'
}

let app = firebase.initializeApp(config);

export default app;