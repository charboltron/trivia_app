'use strict';

//---------------------------------------
//Global variables needed by functions
//---------------------------------------

//TODO: decide if some kind of object would be better to contain these variables. 

var timerId;
var timer;
var times_up;

var question_count;
var score;
var current_question;
var answer_options = [];

//Bools
var guessed;
var started = false;
var sound = false;

//API Variables
var trivia;
var url = 'https://opentdb.com/api.php?amount=10&type=multiple';

//---------------------------------------
//Onclick Function calls from HTML
//---------------------------------------

function load(){ //Hides the buttons until start game is pressed. 
    document.getElementById("guess_buttons").style.visibility = 'hidden';
    document.getElementById("current_question").style.visibility = 'hidden';
    document.getElementById("next_question").style.visibility = 'hidden';
    
    // Chad: This is where I attempt to load the variable stored in localStorage
    // The URL loads, but it is not incorporated into the var url above.
    var apiURL = localStorage.getItem('storedURL');
    var triviaAmount = localStorage.getItem('questionCount');
    console.log(apiURL)
    console.log(triviaAmount)
}

async function start_game(){ //Function is async because of API call

    score = 0;
    //Call API 
    //TODO: update method with passed in url or other idea. 
    //A good idea might be to move the API call to the load() function?
    let response = await fetch(url);
    //console.log(response);
    let data = await response.json();
    trivia = data.results;
    //console.log(trivia);
    
    //Reset variables
    question_count = 0;
    score = 0;
    started = true;
    guessed = false;
    
    //Show the buttons on the screen 
    document.getElementById("guess_buttons").style.visibility = 'visible';
    document.getElementById("current_question").style.visibility = 'visible';
    document.getElementById("next_question").style.visibility = 'visible';
    
    display_next_question();
  }

function display_next_question(){
    
    //Timer
    clearInterval(timerId);
    times_up = false;
    start_timer();
    
    //End of game logic
    guessed = false;
    if(!started){return;}
    if(question_count === 10){
        clearInterval(timerId);
        document.getElementById("display_question_number").innerHTML = ``;
        document.getElementById("category").innerHTML = ``;
        document.getElementById("difficulty").innerHTML = ``;
        document.getElementById("timer").innerHTML = ``;
        document.getElementById("guess_buttons").style.visibility = 'hidden';
        document.getElementById("display_question").innerHTML = "GAME OVER! Start a new game?";
        document.getElementById("display_feedback").innerHTML = ``;
        document.getElementById("display_score").innerHTML = `Final Game Score: ${score}`;
        started = false;
        return;
    }

    //Clear feedback 
    document.getElementById("display_feedback").innerHTML = ``;

    //Prepare the question set and the current question
    answer_options = [];
    current_question = trivia[question_count];
    //console.log(current_question.question);
    console.log(current_question.difficulty);
    
    let question = current_question.question;
    let ans = current_question.correct_answer;
    let wrong_1 = current_question.incorrect_answers[0];
    let wrong_2 = current_question.incorrect_answers[1];
    let wrong_3 = current_question.incorrect_answers[2];

    let category = current_question.category;
    let difficulty = current_question.difficulty
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    
    answer_options.push(ans, wrong_1, wrong_2, wrong_3);
    answer_options = shuffle(answer_options);
    
    //Put the question/choices on the buttons
    document.getElementById("A_button_text").innerHTML = answer_options[0];
    document.getElementById("B_button_text").innerHTML = answer_options[1];
    document.getElementById("C_button_text").innerHTML = answer_options[2];
    document.getElementById("D_button_text").innerHTML = answer_options[3];

    //Display text for questions
    document.getElementById("display_question_number").innerHTML = `QUESTION ${question_count+1}: `;
    document.getElementById("category").innerHTML = `${category} `;
    document.getElementById("difficulty").innerHTML = `Rating: ${difficulty} `;
    document.getElementById("display_question").innerHTML = question;
    
    question_count++;
}

function guess_answer(button_id){
    
    //Timer
    clearInterval(timerId);
    
    //console.log("guessed: "+guessed);
    //console.log("started: "+started);
    
    //Unusual circumstances
    if(guessed || !started){
        return;
    }

    guessed = true;
    
    //Handle button clicked logic 
    var guess_letter;
    switch(button_id){
        case "guess_A":
            guess_letter = answer_options[0];
            break;
            case "guess_B":
            guess_letter = answer_options[1];
            break;
            case "guess_C":
            guess_letter = answer_options[2];
            break;
            case "guess_D":
            guess_letter = answer_options[3];
            break;
        default:
            guess_letter="None"; //??
    }
    //console.log(`${guess_letter} button was pressed`);
    //console.log(`You chose: ${guess_letter}. ${current_question[guess_letter]}`);
    
    //Determine correct or not, award points, give feedback
    if(guess_letter === current_question.correct_answer){
        //console.log("You got it!");
        if(!times_up){
          var bonus; 
          switch(current_question.difficulty){
            case "easy":
                bonus = 0;
                break;
                case "medium":
                bonus = 2;
                break;
                case "hard":
                bonus = 4;
                break;
            default:
                bonus = 0;
        }
          var points = Math.ceil(timer/2);
          console.log(points);
          if(points === 0){
            points++;
          }
          score+= points+bonus;
        }
        let plural = (points === 1? '' : 's');
        //TODO: Give different Feedback based on point value? 
        document.getElementById("display_feedback").innerHTML = `You got it! That's ${points} point${plural}! Bonus: ${bonus}`;
        if(sound){
            var chime = document.getElementById("audio_correct"); 
            chime.play(); 
        }
    }
    else{
        document.getElementById("display_feedback").innerHTML = `Wrong! The answer was: 
        ${current_question.correct_answer}` ;
        if(sound){
            var chime = document.getElementById("audio_incorrect"); 
            chime.play(); 
        }
        //console.log(`Wrong! The answer was: ${current_question["answer"]}. ${current_question[current_question["answer"]]}`);
    }

    //Update score
    document.getElementById("display_score").innerHTML = `Score: ${score}`;
}


//---------------------------------------
//Functions for Widgets
//---------------------------------------

function start_timer() {
  
  timer = 10;
  timerId = setInterval(function(){ 
    document.getElementById("timer").innerText = "TIME: "+timer; 
    timer-=1;
    if(timer === -1){
      times_up = true;
      clearInterval(timerId);
      //display_next_question(); Should the time running out autoload next question? 
    }
  },1000);
    
}

function toggle_sound(){
    sound = !sound;
}


//---------------------------------------
//Miscellaneous functions
//---------------------------------------

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}