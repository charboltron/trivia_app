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
var total_questions;

//Bools
var guessed;
var started = false;
var sound = false;

//API Variables
var trivia;
var apiURL;
var user_signed_in;

//---------------------------------------
//Onclick Function calls from HTML
//---------------------------------------

function load(){ //Hides the buttons until start game is pressed. 
    document.getElementById("guess_buttons").style.visibility = 'hidden';
    document.getElementById("next_question").style.visibility = 'hidden';
    trivia = JSON.parse(localStorage.getItem('apiJSON'));    
    //console.log(`trivia: ${JSON.stringify(trivia)}`);
    total_questions = localStorage.getItem('questionCount');
    total_questions = Number(total_questions);
    //console.log(`total_questions type: ${typeof(total_questions)}`);
    //console.log(`total_questions: ${total_questions}`);
    user_signed_in = localStorage.getItem('userSignedIn');
    console.log(`user signed in is: ${user_signed_in}`);
    // alert(`trivia: ${JSON.stringify(trivia)}\n\ntotal questions: ${total_questions}\n\nuser signed in is: ${user_signed_in}`);
}

async function start_game(){ //Function is async because of API call
    
    //Reset variables
    question_count = 0;
    score = 0;
    started = true;
    guessed = false;
    
    //Show the buttons on the screen and hide start button
    document.getElementById("start").style.visibility = 'hidden';
    document.getElementById("guess_buttons").style.visibility = 'visible';
    
    display_next_question();
  }

function display_next_question(){
    
    display_question_buttons();
    
    //Timer
    clearInterval(timerId);
    times_up = false;
    start_timer();
    
    //End of game logic
    guessed = false;
    if(!started){return;}
    if(question_count == total_questions){

        display_end_game(); 
        started = false;
        return;
    }

    //Clear feedback 
    document.getElementById("display_feedback").innerHTML = ``;

    //Generate next question 
    prepare_questions();
    put_questions_on_buttons();
    display_text_for_questions();

    question_count++;
}

function guess_answer(button_id){
    
    //Timer
    clearInterval(timerId);
    
    //Unusual circumstances
    if(guessed || !started){
        return;
    }

    guessed = true;
    
    //Handle button clicked logic 
    var guess_letter = get_guess_letter(button_id);

    // console.log(`${guess_letter} button was pressed`);
    // console.log(`You chose: ${guess_letter}. ${current_question[guess_letter]}`);
    
    //Determine correct or not, award points, give feedback
    if(guess_letter === current_question.correct_answer){
        document.getElementById(button_id).style.backgroundColor = '#7FFF00';
        //console.log("You got it!");
        if(!times_up){
          var bonus; 
          switch(current_question.difficulty){
            case "easy":
                bonus = 0;
                break;
                case "medium":
                bonus = 200;
                break;
                case "hard":
                bonus = 300;
                break;
            default:
                bonus = 0;
        }
          var bonus_flag = false;
          if(bonus > 0){
            bonus_flag = true;
          }
          var points = Math.ceil(timer/2);
          //console.log(points);
          if(points === 0){
            points++;
          }
          points*=100;
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
        document.getElementById(button_id).style.backgroundColor = '#DC143C';
        var penalty = 0;
        if(timer > 12){
          penalty = 500;
        }else if(timer > 9){
          penalty = 250;
        }
        var penal_factor;
        switch(current_question.difficulty){
          case "easy":
              penal_factor = 300;
              break;
              case "medium":
              penal_factor = 200;
              break;
              case "hard":
              penal_factor = 0;
              break;
          default:
              penal_factor = 0;
      }
        var penal_total = penalty+penal_factor;
        score -= penal_total;
        var penal_flag = false;
        if(penal_total != 0){
          penal_flag = true;
        }
        var feedback_string = `Wrong! The answer was: 
        ${current_question.correct_answer}. `;
        if(penal_flag){
          feedback_string += `Penalty: -${penal_total}`;
        } 
        document.getElementById("display_feedback").innerHTML = feedback_string;
        if(sound){
            var chime = document.getElementById("audio_incorrect"); 
            chime.play(); 
        }
        //console.log(`Wrong! The answer was: ${current_question["answer"]}. ${current_question[current_question["answer"]]}`);
    }

    //Update scores
    // if(penal_flag){
    //   document.getElementById("display_penalty").innerHTML = `PENALTY:\n${penal_total}`;
    // }
    // if(bonus_flag){
    //   document.getElementById("display_bonus").innerHTML = `BONUS:\n${bonus}`;
    // }
    document.getElementById("display_score").innerHTML = `SCORE: ${score}`;

    document.getElementById("next_question").style.visibility = 'visible';
}


//---------------------------------------
//Functions for Widgets
//---------------------------------------

var time_colors = ['1F0', '3F0', '5F0', '7F0', '9F0', 'BF0', 'DF0', 'FF0', 'FD0', 'FB0', 
                   'F90', 'F70', 'F50', 'F30', 'F10', 'F00'];
time_colors.reverse();                   

function start_timer() {
  
  timer = 15;
  timerId = setInterval(function(){ 
    document.getElementById("timer").style.backgroundColor = '#'+time_colors[timer]; 
    document.getElementById("timer").innerText = timer; 
    timer-=1;
    if(timer === 2){   
      if(sound){
        var chime = document.getElementById("final_3_seconds"); 
        chime.play(); 
    }
  }
    if(timer === -1){
      times_up = true;
      clearInterval(timerId);
      //display_next_question(); Should the time running out autoload next question? 
    }
  },1000);
    
}

function toggle_sound(){
    sound = !sound;
    if (sound){
        document.getElementById("toggle_sound").src = "images/sound_icon_on_white.png";
    }
    else {
        document.getElementById("toggle_sound").src = "images/sound_icon_off_white.png";
    }
}


//---------------------------------------
//Next question triggered functions
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

function display_question_buttons(){
    
    document.getElementById("next_question").style.visibility = 'hidden';
    document.getElementById("guess_A").style.backgroundColor = '#FFF';
    document.getElementById("guess_B").style.backgroundColor = '#FFF';
    document.getElementById("guess_C").style.backgroundColor = '#FFF';
    document.getElementById("guess_D").style.backgroundColor = '#FFF';

}

function display_text_for_questions(){

  let question = current_question.question;
  let category = current_question.category;
  let difficulty = current_question.difficulty;
  difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  document.getElementById("display_question_number").innerHTML = `Question ${question_count+1} of ${total_questions} `;
  document.getElementById("category").innerHTML = `${category} -  ${difficulty} `;
  document.getElementById("display_score").innerHTML = `SCORE: ${score} `;
  document.getElementById("display_question").innerHTML = question;

}

function display_end_game(){

  console.log("end of game reached.");
  clearInterval(timerId);
  document.getElementById("display_question_number").innerHTML = ``;
  document.getElementById("category").innerHTML = ``;
  document.getElementById("difficulty").innerHTML = ``;
  document.getElementById("timer").innerHTML = ``;
  document.getElementById("guess_buttons").style.visibility = 'hidden';
  document.getElementById("next_question").style.visibility = 'hidden';
  document.getElementById("start").style.visibility = 'visible';
  document.getElementById("display_question").innerHTML = "GAME OVER! Start a new game?";
  document.getElementById("display_feedback").innerHTML = ``;
  document.getElementById("display_score").innerHTML = `Final Game Score: ${score}`;
}

function prepare_questions(){
  
  answer_options = [];
  current_question = trivia[question_count];

  let ans = current_question.correct_answer;
  let wrong_1 = current_question.incorrect_answers[0];
  let wrong_2 = current_question.incorrect_answers[1];
  let wrong_3 = current_question.incorrect_answers[2];

  answer_options.push(ans, wrong_1, wrong_2, wrong_3);
  answer_options = shuffle(answer_options);
  
}

function put_questions_on_buttons(){
  
  document.getElementById("A_button_text").innerHTML = answer_options[0];
  document.getElementById("B_button_text").innerHTML = answer_options[1];
  document.getElementById("C_button_text").innerHTML = answer_options[2];
  document.getElementById("D_button_text").innerHTML = answer_options[3];

}

function get_guess_letter(button_id){
  
  let guess = '';
  switch(button_id){
    case "guess_A":
        guess = answer_options[0];
        break;
    case "guess_B":
        guess = answer_options[1];
        break;
    case "guess_C":
        guess = answer_options[2];
        break;
    case "guess_D":
        guess = answer_options[3];
        break;
    default:
        guess_letter="None"; //??
  }
  return guess;
}
