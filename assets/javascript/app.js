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
					$("#trivia").append("<button class='anwrButton' id='button-"+ j +"' dataName='"+
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
	audio.setAttribute("src", "../images/triviaMusic.mp3");

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
				else if (timerStatus.clockCount <=-1 && gameScore.qCount === 0) {
					alert("Your time is up! Let's see how you scored.");
					gameScore.qCount--;
					game.done();
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
				
			if (chosenQ === playedQ) { //if the randomly chosen question was already played, then pick again.
				game.chooseQ();
			}
			else {
				gameTrivia(); //if the question was not already played.. play it!
			}
		},

		guessed: function (e) {
			console.log(guessed(e));
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
			$("#score").html("<h2> Correct: " + gameScore.correct + ", <span> Wrong: " + gameScore.wrong + 
				", <span> Unanswered: " + gameScore.unanswered + ", <span> Left: " + gameScore.qCount + "</h2>");
			
			clearInverval(timerStatus.countDown);
			clearInverval(timerStatus.gameCount);
			timerStatus.stopT();

			$("#buttonMain").empty().append("Try Again!"); //WILL THIS WORK IF IT IS REMOVED EARLIER?
			$("#trivia").empty().append("<p>What do you think? Whant to try again?<br>Here are the one's you got wrong: "
				+ wrongAnswers + "<br>Here are the one's you got right: " + rightAnswers + "</p>");
		}
	};

// ---------------------------------------------------------------------------------------------------------------	-----------------------------------
// ---------------------------------------------------------------------------------------------------------------	-----------------------------------
	
	//GAME START:

	clockRunning = false;
	$("#buttonMain").on("click", function () {
		console.log("You clicked Start (the 'mainButton'!");
		
		game.startGame ();
		game.chooseQ ();

		$(".audio").on("click", function() {
			if(!audio.play()){
				audio.play();
			}
			else {
				audio.pause();
			}
		});

		$(document).on("click",".anwrButton",function(){ 
			game.guessed ();
		});


	//AUDIO IDEAS:
		// $(".music").on("click", function () {
		// 	if (!audio.play()) {
		// 		audio.play();
		// 	}
		// 	else {
		// 		audio.pause();
		// 	}
		// });

	//GAME FUNCITONS:
		// $("#"+randomQ+"").on("click", function() { //work on finding a way to compare the guess with answer
		// 		console.log("comparing the guess with answer: #"+randomQ);
		// 			if (chosenQ.answerList[j] === chosenQ.correctAnwr){
		// 				gameScore.correct++;
		// 				gameScore.unanswered--;
		// 				gameScore.qCount--;
		// 			}
		// 			else {
		// 				gameScore.wrong++;
		// 				gameScore.unanswered--;
		// 				gameScore.qCount--;
		// 				wrongAnswers.push(chosenQ.answerList[j]);	
		// 			}
		// });

	});

}); //end of app.js file
// ---------------------------------------------------------------------------------------------------------------	-----------------------------------
// ---------------------------------------------------------------------------------------------------------------	-----------------------------------

		// $("#buttonMain").append(audio);
  //  		audio.play();

  // 		var audio = $("#music").get();
		// audio.text("the tunes");
		// audio.play();

//$("button[id='button-"+randomQ+"']:checked"), function(){


// //////REFERENCE THIS FOR COMPLETION:////////
// $(document).ready(function() { // This waits for the document to complete loading before initiating JS file.

// 	// ================================== GLOBAL VARIABLES ========================================

// 	var userName = prompt("What is your avatar's name?");
// 	$("#welcomeAva").html("Hey " + userName + "!");

// //QUESTION OBJECT ARRAY:
// 	var questionOptions = [{
// 		question: "What do the letters in the acronym CD-ROM stand for?",
// 		answerList: ["Compact Disk Read Only Memory", "Compact Drive Read Only Medium",
// 		 "Computer Drive Read Optimal Memory", "Who uses CD-ROMs? I keep my head in the Clouds!"],
// 		correctAnwr: "Compact Disk Read Only Memory",
// 	}, {
// 		question: "1,024 Gigabytes is equal to one which of the following?",
// 		answerList: ["1 Gigabyte", "1024 Bytes", "1 Terabyte", "Enough storage for my music!"],
// 		correctAnwr: "1 Terabyte",
// 	}, {
// 		question: "In what year was the first Apple computer released?",
// 		answerList: ["1987", "1980", "1976", "All I know is that it happened before I was born!"],
// 		correctAnwr: "1976",
// 	}, {
// 		question: "In computer science, what does 'GUI' stand for?",
// 		answerList: ["Graphical User Interface", "Globally Unique Identification", "Global User Interface", "Get User Information"],
// 		correctAnwr: "Graphical User Interface",
// 	}, {
// 		question: "What year was Facebook founded?",
// 		answerList: ["2006", "2004", "1998", "The year MySpace died."],
// 		correctAnwr: "2004",
// 	}, {
// 		question: "The companies HP, Microsoft and Apple were all started in a what?",
// 		answerList: ["Think Tank", "Classroom", "Conference Center", "Garage"],
// 		correctAnwr: "Garage",
// 	}, {
// 		question: "Fonts that contain small decorative lines at the end of a stroke are known as what?",
// 		answerList: ["Curved Fonts", "Serif Fonts", "Sans-Serif Fonts", "Fonts have decorative lines?"],
// 		correctAnwr: "Serif Fonts",
// 	}, {
// 		question: "Who is credited with inventing the first mechanical computer?",
// 		answerList: ["Steve Jobs", "Charles Babbage", "Alan Turing", "Jedd Fenner"],
// 		correctAnwr: "Charles Babbage",
// 	}, {
// 		question: "When referring to computer memory, what does the acronym RAM stand for?",
// 		answerList: ["Read Array Method", "Random Access Memory", "Radar Absorbent Material", "Remote Area Maintenance!"],
// 		correctAnwr: "Random Access Memory",
// 	}, {
// 		question: "With over 17 million units produced, what is recorded in the Guinness World Records as the top selling single model of personal computer?",
// 		answerList: ["ThinkPad", "Sun-1", "Macintosh II", "The Commodore 64"],
// 		correctAnwr: "The Commodore 64",
// 	}];

// 	function randomNum (min,max){
// 	  return(Math.floor(Math.random()*((max+1) - min)) + min);
// 	}

// 	var randomQ = randomNum (1, questionOptions.length);
// 	var chosenQ = questionOptions[randomQ]; 

// //TIMER
// 	var clockRunning = false;
// 	var clockCount = {
// 		time: 0,
// 		start: function () {
// 			if (!clockRunning) {
// 				clockRunning = true;
// 				setInterval(clockCount.count, 1000 *30); //resets the clock every
				
// 				var timeDisplay = clockCount.timeMinSec(clockCount.time);
// 				$("#gameStats").html("<h2> Timer: " + timeDisplay + "</h2>");  //initiate the time display (converts seconds to min&secs AND displays them)
// 			}
// 		},
// 		stop: function () {
// 			if (clockRunning) {
// 			clockRunning = false;
// 			}
// 		},
// 		reset: function () {
// 			clockCount.time = 0;
// 			$("#gameStats").text("Timer: 00:00"); //Make the "display" div to "00:00. --> important to use "text" and not "html," as this is a number and not a string!"
// 		},
// 		timeMinSec: function (time) {  //Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
// 		    var minutes = Math.floor(time / 60);
// 		    var seconds = time - (minutes * 60);

// 		    if (seconds < 10) {
// 		      seconds = "0" + seconds;
// 		    }
// 		    if (minutes === 0) {
// 		      minutes = "00";
// 		    }
// 		    else if (minutes < 10) {
// 		      minutes = "0" + minutes;
// 		    }
// 		    return minutes + ":" + seconds;
// 		}
// 	};

// //TIMERS 
// //Create the following timer: 1)Transition between Qs and 2)Transition to the end of the game page.
// 	//1)  setTimeout(nextQuestion, 1000 * 30); //30,000 milli-seconds === 30 seconds --> time allowence for each page.
// 	//2)  setTimeout(gameOver, 1000 * 500); // 500,000 mili-seconds === 5 minutes for the full game! (10 question pages total.)

// //AUDIO:
// 	var auDio = document.createElement("audioTrivia"); // Create an audio element with JavaScript...
// 	auDio.setAttribute("src", "../images/triviaMusic.mp3"); // AND set it's source to the sited location.



// 	// ================================== BUTTON/MUSIC EVENT HANDLERS ========================================

// 	$("#buttonMain").on("click", function () {
// 		// auDio.play();
// 		// console.log("Start Game Music");

// 		// var pauseButton = $("<button>");
// 		// pauseButton.addClass("noMusic");
// 		// pauseButton.text("Pause Music");
// 		// $("#buttonMain").append(pauseButton);
		
// 		// $("#pauseButton").on("click", function() {
// 		// 	auDio.pause();
// 		// });

// 		clockCount.start(); //start timer
// 		console.log("Start Game Timer Started:" + clockCount.start);

// 		for (var i = 0; i < questionOptions.length; i++) { //display one of the questions
// 			$("trivia").html("<h3>" + chosenQ.question +"</h3>");
// 			console.log(chosenQ.question);
// 		}

	  	
// 		//display question and answer options
// 		//

// 		//FUNCTIONS TO USE IN GAME:
// 		// function nextQuestion() {
// 	 //        $("#buttonMain").replace("<button>Let's test out your tech facts</button>", 
// 	 //        	"<button>Next Quetion</button>");
// 		// 	console.log("Next Question Timer");
// 		// 	reset()
// 		// }

// 		// function gameOver() {
// 	 //        $("#avaText").replace("<h2>Are you really a tech pro? Click the button below to find out!</h2>", 
// 	 //        	"<h2> Time is up! Here are your results!</h2>");
// 	 //        console.log("Game Over Timer");s
	        
// 	 //        reset();
// 	 //        stop();
// 	 //    }

// 	});

// });
