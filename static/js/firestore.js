// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyADX_r-DQofskj4z5MQRi-oXrEA0NNsHfI",
    authDomain: "jemmastablesbokningssystem.firebaseapp.com",
    databaseURL: "https://jemmastablesbokningssystem.firebaseio.com",
    projectId: "jemmastablesbokningssystem",
    storageBucket: "jemmastablesbokningssystem.appspot.com",
    messagingSenderId: "326005635203",
    appId: "1:326005635203:web:28e8a76a86ba607dbbc3b6",
    measurementId: "G-9PF133Z3MH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

var getDaysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
}

var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
var monthDays = new Map();

months.forEach(function(month) {
    monthDays.set(month, getDaysInMonth(months.indexOf(month) + 1, new Date().getFullYear()))
});