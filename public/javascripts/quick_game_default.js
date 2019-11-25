document.getElementById("quick_game").onclick = function() { set_default_game() };

async function set_default_game() {
    console.log('default game function called');

    let apiURL = 'https://opentdb.com/api.php?amount=10&type=multiple';
    let response = await fetch(apiURL);
    let data = await response.json();
    console.log(data.results);
    var trivia = data.results;
    if(data.response_code != 0){
        alert("We apologize, but there was an error."); //lol
    } else{
        localStorage.setItem('apiJSON', JSON.stringify(trivia));
        localStorage.setItem('questionCount', 10);
        document.getElementById("quick_game_hidden_button").click();
    }
}