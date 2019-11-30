window.onload = function(){ load_setup(); }

// document.getElementById("btnstartgame").onclick = function() { SubmitGameSetup() };

var user_signed_in = '';

function load_setup() { // checks to ensure the user is already logged in
    user_signed_in = localStorage.getItem('userSignedIn');
    console.log(`user_signed_in is: ${user_signed_in}`);
    if (user_signed_in === (null || '' || false )) {
        console.log('user not signed in');
        alert("Please sign in before choosing game settings.");
        window.location.replace('sign_in');
    } else {
        console.log('user seems signed in')
        alert('this does not make sense')
    }
}

async function SubmitGameSetup() {
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
