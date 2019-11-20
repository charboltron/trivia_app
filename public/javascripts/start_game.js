'use strict';
var count;
var score;
var current_question;
var question_set = [];
var guessed;
var started =false;
var sound = false;
var trivia;
var url = 'https://opentdb.com/api.php?amount=10&type=multiple';

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
  

function load(){
    document.getElementById("guess_buttons").style.visibility = 'hidden';
    document.getElementById("current_question").style.visibility = 'hidden';
    document.getElementById("next_question").style.visibility = 'hidden';
}

async function start_game(){

    let response = await fetch(url);
    console.log(response);
    let data = await response.json();
    trivia = data.results;
    console.log(trivia);
    count = 0;
    score = 0;
    started = true;
    guessed = false;
    // for(let i = 0; i < 10; i++){
    //   //console.log("\nQuestion "+ (i+1) + "/10:\n");
    //   var rand = trivia[Math.floor(Math.random() * trivia.length)];
    //   question_set.push(rand);
    //   //console.log(rand["question"],"\nA.",rand["A"],"\nB.",rand["B"],"\nC.",rand["C"],"\nD.",rand["D"]);
    // }
    
    document.getElementById("guess_buttons").style.visibility = 'visible';
    document.getElementById("current_question").style.visibility = 'visible';
    document.getElementById("next_question").style.visibility = 'visible';
    display_next_question();
  }

function display_next_question(){
    question_set = [];
    guessed = false;
    if(!started){return;}
    if(count === 10){
        document.getElementById("display_question_number").innerHTML = ``;
        document.getElementById("display_question").innerHTML = "GAME OVER! Start a new game?";
        started = false;
        return;
    }
    document.getElementById("display_feedback").innerHTML = ``;
    console.log("HERE");
    current_question = trivia[count];
    console.log(current_question.question);
    let question = current_question.question;
    let ans = current_question.correct_answer;
    let wrong_1 = current_question.incorrect_answers[0];
    let wrong_2 = current_question.incorrect_answers[1];
    let wrong_3 = current_question.incorrect_answers[2];
    question_set.push(ans, wrong_1, wrong_2, wrong_3);
    question_set = shuffle(question_set);
    document.getElementById("A_button_text").innerHTML = question_set[0];
    document.getElementById("B_button_text").innerHTML = question_set[1];
    document.getElementById("C_button_text").innerHTML = question_set[2];
    document.getElementById("D_button_text").innerHTML = question_set[3];
    document.getElementById("display_question_number").innerHTML = `QUESTION ${count+1}: `;
    document.getElementById("display_question").innerHTML = question;
    //document.getElementById("display_choices").innerHTML = "A. "+ans_a+"  B. "+ans_b+"  C. "+ans_c+"  D. "+ans_d;
    count++;
}

function guess_answer(button_id){
    console.log("guessed: "+guessed);
    console.log("started: "+started);
    if(guessed || !started){
        return;
    }
    guessed = true;
    var guess_letter;
    switch(button_id){
        case "guess_A":
            guess_letter = question_set[0];
            break;
            case "guess_B":
            guess_letter = question_set[1];
            break;
            case "guess_C":
            guess_letter = question_set[2];
            break;
            case "guess_D":
            guess_letter = question_set[3];
            break;
        default:
            guess_letter="None"; //??
    }
    console.log(`${guess_letter} button was pressed`);
    //console.log(`You chose: ${guess_letter}. ${current_question[guess_letter]}`);
    if(guess_letter === current_question.correct_answer){
        console.log("You got it!");
        score++;
        document.getElementById("display_feedback").innerHTML = `You got it!`;
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
    document.getElementById("display_score").innerHTML = `Score: ${score}`;
}

function toggle_sound(){
    sound = !sound;
}