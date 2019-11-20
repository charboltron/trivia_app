
document.getElementById("btnstartgame").onclick = function() { SubmitGameSetup() };

function SubmitGameSetup() {
    var triviaAmount = document.getElementById("trivia_amount").value;
    var triviaCategory = document.getElementById("trivia_category").value;
    var triviaDifficulty = document.getElementById("trivia_difficulty").value;
    var triviaType = document.getElementById("trivia_type").value;
    var triviaEncode = document.getElementById("trivia_encode").value;

    console.log("# of questions: " + triviaAmount);
    console.log("trivia category: " + triviaCategory);
    console.log("trivia difficulty: " + triviaDifficulty);
    console.log("trivia type: " + triviaType);
    console.log("trivia_encode" + triviaEncode);

    var apiURL =    'https://opentdb.com/api.php?' + 
                    'amount=' + triviaAmount +
                    (triviaCategory == 'any' ? '' : ('&category=' + triviaCategory)) +
                    (triviaDifficulty == 'any' ? '' : ('&difficulty=' + triviaDifficulty)) +
                    '&type=' + triviaType;
    
    console.log(apiURL);
}
