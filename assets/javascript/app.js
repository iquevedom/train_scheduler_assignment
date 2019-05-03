// Initialize Firebase
var config = {
  apiKey: "AIzaSyDutDWYRRTsMsvMhRH33WYDEf-v27qwLu0",
  authDomain: "myprojectiq.firebaseapp.com",
  databaseURL: "https://myprojectiq.firebaseio.com",
  projectId: "myprojectiq",
  storageBucket: "myprojectiq.appspot.com",
  messagingSenderId: "76432825283"
};
firebase.initializeApp(config);

var database = firebase.database();

// Cleans the form after get the info
function cleanForm() {
  $("#train-name").val("");
  $("#trainDestination").val("");
  $("#firstTrainTime").val("");
  $("#frecuency").val("");
};

// Get the user info and push it in firebase
$("#submit").on("click", function (event) {

  event.preventDefault();

  var trainName = $("#train-name").val().trim();
  var destination = $("#trainDestination").val().trim();
  var firstTrain = $("#firstTrainTime").val().trim();
  var frecuency = $("#frecuency").val().trim();

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frecuency: frecuency
  });

  cleanForm();
});

// Display the Firebase info
database.ref().on("child_added", function (snapshot) {

  var sv = snapshot.val();
 
  // Debugg
  console.log(sv.trainName)
  console.log(sv.destination)
  console.log(sv.firstTrain)
  console.log(sv.frecuency)

  // Calculates how many minutes left for the next train and the time
  var actualTime = moment();
  var firstTrainConverted = moment(sv.firstTrain, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  var timeMod = diffTime % sv.frecuency;
  var minutesTilNext = sv.frecuency - timeMod;
  var timeNext = moment().add(minutesTilNext, "minutes");

// Debugg
  console.log("Hora actual : " + moment(actualTime).format("hh:mm"));
  console.log("time user converted :" + firstTrainConverted);
  console.log(" minutos " + diffTime);
  console.log("Minutes mod : " + timeMod);
  console.log(minutesTilNext);
  console.log("Next train : " + moment(timeNext).format("hh:mm"));

// Display the firebase info
  var newRow = $("<tr>").append(
    $("<td>").text(sv.trainName),
    $("<td>").text(sv.destination),
    $("<td>").text(sv.frecuency),
    $("<td>").text(moment(timeNext).format("hh:mm")),
    $("<td>").text(minutesTilNext),
  );

  // Append the new row to the table
  $("#trains tbody").append(newRow);

});


