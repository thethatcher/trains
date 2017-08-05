// Initialize Firebase
var config = {
apiKey: "AIzaSyD53kwGdJEQ6VhvZpjvN26LrlNhBNpZRaA",
authDomain: "bootcamptrains-3d29e.firebaseapp.com",
databaseURL: "https://bootcamptrains-3d29e.firebaseio.com",
projectId: "bootcamptrains-3d29e",
storageBucket: "bootcamptrains-3d29e.appspot.com",
messagingSenderId: "858593073030"
};
firebase.initializeApp(config);

var db = firebase.database();

var name, dest, freq, start, nextTime, minutes, firstTrainMarker;


db.ref().on("value", function(snap){
	$("#trainTableBody").html("<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes to Departure</th></tr>");
	snap.forEach(function(childSnap){
		console.log("snapshot value: ",childSnap.val());
		name = childSnap.val().name;
		dest = childSnap.val().destination;
		freq = childSnap.val().frequency;
		start = childSnap.val().startTime;
		nextTime = calcNextTime(moment(start,"HH:mm"),freq);
		minutes = nextTime.diff(moment(),"minutes");
		
		var tableRow = "<tr><th class='tableRowData'>" + name + 
	      "</th><th class='tableRowData'>" + dest + 
	      "</th><th class='tableRowData'>" + freq +
	      "</th><th class='tableRowData'>" + nextTime.format("hh:mm A") + firstTrainMarker +
	      "</th><th class='tableRowData'>" + minutes +"</th>";
	    $("#trainTableBody").append(tableRow);
	})
	if(!snap.val()){
		$("#trainTableBody").html("<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes to Departure</th></tr>");
	}
})

function train(name,dest,freq,start){
	this.name = name;
	this.destination = dest;
	this.frequency = freq;
	this.startTime = start;
}

function calcNextTime(start, frq){
	var rtn = moment();
	if(start < moment()){
		var timeSinceStart = moment().diff(start,"minutes");
		console.log("Start time has passed: ", start, rtn);
		console.log("minutes passed: ", timeSinceStart);
		var tempcalc = frq - (timeSinceStart % frq);
		console.log(start.format("HH:mm"),frq,tempcalc);
		rtn = moment().add(moment.duration(tempcalc,"minutes"));
		firstTrainMarker = "";
	}
	else{
		console.log("Start time is coming up", start);
		firstTrainMarker = " *";
		rtn = start;
	}
	console.log("return value: ", rtn.format());
	return rtn;
}
 
$("#formTrain").submit(function(event){
	event.preventDefault();	
	name = $("#name").val().trim();
	dest = $("#destination").val().trim();
	freq = $("#frequency").val().trim();
	start = $("#start").val().trim();

	console.log(name,dest,freq,start);
	var tempTrain = new train(name, dest, freq, start);
	console.log("train object",tempTrain);
	db.ref().push(tempTrain);
	console.log("success submit");
});

$("#clearBtn").click(function(){
	db.ref().set({});
});