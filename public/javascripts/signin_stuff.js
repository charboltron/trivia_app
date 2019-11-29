
document.getElementById("btnsignin").onclick = function() { SubmitSignIn() };

async function SubmitSignIn() {
    // MODIFY CODE STARTING HERE!!
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
    let response = await fetch(apiURL);
    let data = await response.json();
    console.log(data.results);
    var trivia = data.results;

    if(data.response_code != 0){
        alert("We apologize, but there are not enough questions to meet your query, please try again.");
    } else{
        localStorage.setItem('apiJSON', JSON.stringify(trivia));
        localStorage.setItem('questionCount',triviaAmount);
        var x = localStorage.getItem('apiJSON')
        //console.log(x);
        document.getElementById("hidden_start_game_button").click();
    }
}
