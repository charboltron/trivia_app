'use strict';


// let count = 0;
// let score = 0;

function start_game(){

const fs = require('fs');
let rawdata = fs.readFileSync('./trivia.json');
let trivia = JSON.parse(rawdata);  
  for(let i = 0; i < 10; i++){
    console.log("\nQuestion "+ (i+1) + "/10:\n");
    var rand = trivia[Math.floor(Math.random() * trivia.length)];
    console.log(rand["question"],"\nA.",rand["A"],"\nB.",rand["B"],"\nC.",rand["C"],"\nD.",rand["D"]);
  }
}