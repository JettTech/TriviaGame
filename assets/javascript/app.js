$(document).ready(function() {

// --------------------------------------------------------------------
//GLOBAL VARIABLES AND FUNCTIONS:
	
	//TRIVIA QUESTIONS:
	var questionOptions = [{
		question: "What do the letters in the acronym CD-ROM stand for?",
		answerList: ["Compact Disk Read Only Memory", "Compact Drive Read Only Medium",
			"Computer Drive Read Optimal Memory", "Who uses CD-ROMs? I keep my head in the Clouds!"],
		correctAnwr: "Compact Disk Read Only Memory",
	}, {
		question: "1,024 Gigabytes is equal to one which of the following?",
		answerList: ["1 Gigabyte", "1024 Bytes", "1 Terabyte", "Enough storage for my music!"],
		correctAnwr: "1 Terabyte",
	}, {
		question: "In what year was the first Apple computer released?",
		answerList: ["1987", "1980", "1976", "All I know is that it happened before I was born!"],
		correctAnwr: "1976",
	}, {
		question: "In computer science, what does 'GUI' stand for?",
		answerList: ["Graphical User Interface", "Globally Unique Identification", "Global User Interface", "Get User Information"],
		correctAnwr: "Graphical User Interface",
	}, {
		question: "What year was Facebook founded?",
		answerList: ["2006", "2004", "1998", "The year MySpace died."],
		correctAnwr: "2004",
	}, {
		question: "The companies HP, Microsoft and Apple were all started in a what?",
		answerList: ["Think Tank", "Classroom", "Conference Center", "Garage"],
		correctAnwr: "Garage",
	}, {
		question: "Fonts that contain small decorative lines at the end of a stroke are known as what?",
		answerList: ["Curved Fonts", "Serif Fonts", "Sans-Serif Fonts", "Fonts have decorative lines?"],
		correctAnwr: "Serif Fonts",
	}, {
		question: "Who is credited with inventing the first mechanical computer?",
		answerList: ["Steve Jobs", "Charles Babbage", "Alan Turing", "Jedd Fenner"],
		correctAnwr: "Charles Babbage",
	}, {
		question: "When referring to computer memory, what does the acronym RAM stand for?",
		answerList: ["Read Array Method", "Random Access Memory", "Radar Absorbent Material", "Remote Area Maintenance!"],
		correctAnwr: "Random Access Memory",
	}, {
		question: "With over 17 million units produced, what is recorded in the Guinness World Records as the top selling single model of personal computer?",
		answerList: ["ThinkPad", "Sun-1", "Macintosh II", "The Commodore 64"],
		correctAnwr: "The Commodore 64",
	}];

	function randomNum (min,max){
		return(Math.floor(Math.random()*((max+1) - min)));
	}

	var randomQ = randomNum (1, questionOptions.length);
	var chosenQ = questionOptions[randomQ]; 
	var playedQ = [];

	var wrongAnswers = "";
	var rightAnswers = ""; 

	function gameTrivia(){
			$("#trivia").empty();	
			$("#trivia").append("<p>" + chosenQ.question +"</p>");
			console.log(chosenQ.question);
				
				for (var j = 0; j < chosenQ.answerList.length; j++) {
					$("#trivia").append("<button class='anwrButton' id='button-"+ j +"' name='"+
					  chosenQ.answerList[j]+"'>" + chosenQ.answerList[j] + "</button>"); //.after(" ") doesn't work for space.. what will add space?
					console.log(chosenQ.answerList[j]);
				}
	}

// --------------------------------------------------------------------
	//AUDIO: --> ASK FOR HELP; THIS DOES NOT WORK.
	// var audio = $("<button>");
	// audio.addClass("music");
	// audio.attr("src", "../images/triviaMusic.mp3");
	// audio.html("<img src='../images/musicSymbol2.jpg' alt='the tunes'>"); //why doesn't the image show?


	var audio = document.createElement("audio"); // Create an audio element with JavaScript...
	audio.setAttribute("src", "assets/images/triviaMusic.mp3");

// --------------------------------------------------------------------

	//TIMER:
	var clockRunning = false;
	var timerStatus = {
			clockCount: 30,
			gameCount: 300,
			countDown: function () {
				timerStatus.clockCount--;
				timerStatus.gameCount--;

				if (timerStatus.clockCount <= -1) {
					alert("It's time for the next question!");
					gameScore.qCount--;
					game.nextQ();
				}

				var timeDisplay = timerStatus.timeMinSec(timerStatus.gameCount);
				$("#gameStats").html("Question Time Remaining: " + timerStatus.clockCount + "<br> Game Timer: " + timeDisplay);
			},
			startT: function () {
				if(!clockRunning){
					clockRunning = true;
				}
			},
			stopT: function () {
				if(clockRunning){
					clockRunning = false;

					clearInverval(setTimer);
					clearInverval(setGameT);
					
					timerStatus.clockCount = 00;
					timerStatus.gameCount = 00 + ":" + 00;
					var timeDisplay = timerStatus.timeMinSec(timerStatus.gameCount);
					$("#gameStats").html("Question Time Remaining: " + timerStatus.clockCount + "<br> Game Timer: " + timeDisplay)
				}
			},
			resetT: function () {
				timerStatus.clockCount = 30;
				timerStatus.gameCount = timerStatus.gameCount + 1; //WHY would "+=" NOT WORK?
				var timeDisplay = timerStatus.timeMinSec(timerStatus.gameCount);
				$("#gameStats").html("Question Time Remaining: " + timerStatus.clockCount + "<br> Game Timer: " + timeDisplay);
			},
			timeMinSec: function (time) {  //Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
				var minutes = Math.floor(time / 60);
				var seconds = time - (minutes * 60);

				if (seconds < 10) {
				  	seconds = "0" + seconds;
				}
				if (minutes === 0) {
					minutes = "00";
				}
				else if (minutes < 10) {
					minutes = "0" + minutes;
				}
				return minutes + ":" + seconds;
			}
	};

	var setTimer = "";
	var setGameT = ""; //Why do these have to be set to "" (empty strings...) for the timer to not start running immediately / on load?!

// ---------------------------------------------------------------------------------------------------------------	-----------------------------------

	//GAME SCORES & LOGIC:
	var gameScore = {
		correct: 0,
		wrong: 0,
		unanswered: 10,
		qCount: 10
	}; 	

	var game = {
		startGame: function () {	
			clockRunning = false;
			$("#avaText").empty();
			$("#buttonMain").remove();

			$("#score").html("<h2> Correct: " + gameScore.correct + ", <span> Wrong: " + gameScore.wrong + 
				", <span> Unanswered: " + gameScore.unanswered + ", <span> Left: " + gameScore.qCount + "</h2>");

			timerStatus.startT();
			timerStatus.countDown();
			setTimer = setInterval(timerStatus.countDown, 1000); //the number is counted in MILISECONDS!! Therefore 1k === 1 second!!!:D;
			setGameT = setInterval(timerStatus.gameCount, 1000);
		},

		chooseQ: function () {
			randomQ = randomNum (1, questionOptions.length);
			chosenQ = questionOptions[randomQ];
			console.log(chosenQ);
			
			playedQ.push(chosenQ);
				
			if (chosenQ == playedQ) { //if the randomly chosen question was already played, then pick again.
				game.chooseQ();
			}
			else {
				gameTrivia(); //if the question was not already played.. play it!
			}
		},

		guessed: function (e) {

			if ($(e.target).data("name") === chosenQ.correctAnwr){
				gameScore.correct++;
				gameScore.unanswered--;
				gameScore.qCount--;
				rightAnswers.push($(this).val());
				game.nextQ();
			}
			else {
				gameScore.wrong++;
				gameScore.unanswered--;
				gameScore.qCount--;
				wrongAnswers.push($(this).val());
				game.nextQ();
			}
		},

		nextQ: function () {
			$("#score").html("<h2> Correct: " + gameScore.correct + ", <span> Wrong: " + gameScore.wrong + 
				", <span> Unanswered: " + gameScore.unanswered + ", <span> Left: " + gameScore.qCount + "</h2>");

			timerStatus.resetT();
			setTimer;
			setGameT;
			
			game.chooseQ();
		},

		done: function() {
			clearInverval(timerStatus.countDown);
			clearInverval(timerStatus.gameCount);
			timerStatus.stopT();

			$("#score").html("<h2> Correct: " + gameScore.correct + ", <span> Wrong: " + gameScore.wrong + 
				", <span> Unanswered: " + gameScore.unanswered + ", <span> Left: " + gameScore.qCount + "</h2>");
			$("#gameStats").html("Your Game Time: " + (10 - timerStatus.gameCount));
			

			$("#buttonMain").empty().append("Try Again!"); //WILL THIS WORK IF IT IS REMOVED EARLIER?
			$("#trivia").empty().append("<p>What do you think? Whant to try again?<br>Here are the one's you got wrong: "
				+ wrongAnswers + "<br>Here are the one's you got right: " + rightAnswers + "</p>");
		}
	};

// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
	
	//GAME START:

	clockRunning = false;
	$("#buttonMain").on("click", function () {
		console.log("You clicked Start (the 'mainButton'!");
		
		game.startGame ();
		game.chooseQ ();
	});

	// $(".audio").on("click", function() {
	$(document).on("click", ".audio", function() {
			if(!audio.play()){
				audio.play();
			}
			else {
				audio.pause();
			}
	});
			
	$(document).on("click",".anwrButton", function(e) { 
			console.log(e);
			game.guessed(e);
	});


	if (gameScore.qCount <= 0) {
		alert("Your time is up! Let's see how you scored.");
		game.done();
	};

	
}); //end of app.js file
// ---------------------------------------------------------------------------------------------------------------	-----------------------------------