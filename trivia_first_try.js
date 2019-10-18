'use strict';

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fs = require('fs');
let rawdata = fs.readFileSync('./trivia.json');
let trivia = JSON.parse(rawdata);
let count = 0;
let score = 0;

var recursiveAsyncReadLine = function () {
  if(count == 10){
    console.log("\n\nGame over! Your score: "+score);
    process.exit();
  }
  console.log("\nQuestion "+ (count+1) + "/10:\n");
  var rand = trivia[Math.floor(Math.random() * trivia.length)];
  console.log(rand["question"],"\nA.",rand["A"],"\nB.",rand["B"],"\nC.",rand["C"],"\nD.",rand["D"]);
  rl.question('Make a guess: ', (guess) => {
      //guess = guess.toUpperCase;
      console.log(`You chose: ${guess}. ${rand[guess]}`);
      if(guess === rand["answer"]){
          console.log("You got it!");
          score++;
      }
      else{
          console.log(`Wrong! The answer was: ${rand["answer"]}. ${rand[rand["answer"]]}`);
      }
      rl.close;
    count++;
    recursiveAsyncReadLine(); //Calling this function again to ask new question
    
  });
};
console.log("\n\nWELCOME TO THE GAME!!!!");
recursiveAsyncReadLine();
