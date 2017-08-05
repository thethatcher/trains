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

var name, dest, freq, start, nextTime, minutes;


db.ref().on("value", function(snap){
	$("#trainTableBody").html("<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes to Departure</th></tr>");
	snap.forEach(function(childSnap){
		console.log("snapshot value: ",childSnap.val());
		name = childSnap.val().name;
		dest = childSnap.val().destination;
		freq = childSnap.val().frequency;
		start = childSnap.val().startTime;
		nextTime = calcNextTime(moment(start,"HH:mm"),moment.duration(freq,"minutes"));
		minutes = 10;
		
		var tableRow = "<tr><th class='tableRowData'>" + name + 
	      "</th><th class='tableRowData'>" + dest + 
	      "</th><th class='tableRowData'>" + freq +
	      "</th><th class='tableRowData'>" + nextTime.format("hh:mm A") +
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

function calcNextTime(start, freq){
	var rtn = moment();
	if(start < rtn){
		var timeSinceStart = rtn.diff(start,"minutes");
		console.log("Start time has passed: ", start, rtn);
		console.log("minutes passed: ", timeSinceStart);
		rtn = moment().add(moment.duration(timeSinceStart % freq));
	}
	else{
		console.log("Start time is coming up", start);
		rtn = start;
	}
	console.log("return value: ", rtn);
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