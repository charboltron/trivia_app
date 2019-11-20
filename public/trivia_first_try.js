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

console.log("\n\nWELCOME TO THE GAME!!!!");
var recursiveAsyncReadLine = function () {
  console.log("\nQuestion "+ (count+1) + "/10:\n");
  var rand = trivia[Math.floor(Math.random() * trivia.length)];
  console.log(rand["question"],"\nA.",rand["A"],"\nB.",rand["B"],"\nC.",rand["C"],"\nD.",rand["D"]);
  rl.question('Make a guess: ', (answer) => {
      //answer = answer.toUpperCase;
      console.log(`You chose: ${rand[answer]}`);
      if(answer === rand["answer"]){
          console.log("You got it!");
          score++;
      }
      else{
          console.log("Wrong! The answer was: " +rand["answer"]);
      }
      rl.close;
    recursiveAsyncReadLine(); //Calling this function again to ask new question
    count++;
  });
  if(count == 10){
    console.log("\n\nGame over! Your score: "+score);
    process.exit();
  }
};

recursiveAsyncReadLine();
