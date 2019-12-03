
window.onload = function(){ loadLeaderB(); }



function loadLeaderB(){ //Hides the buttons until start game is pressed. 
    console.log('getting current leaderboard');
    
    // get_leaders('/leaderboard', {}, "leaderframe", "GET"); // its an older approach, but it checks out
    
    var leaderJSON;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/leaderboard"); 
    xhr.onload = function(event){ 
        // alert("Success, server responded with: " + event.target.response); // raw response
        leaderJSON = event.target.response;
        console.log(leaderJSON)
        console.log(leaderJSON.length)
    }; 
    xhr.onerror = function(event){
        alert("There was an error getting the leaderboard. Please try again later.")
    }
    xhr.onabort = function(event){
        alert("There was an error getting the leaderboard. Please try again later.")
    }
    let formData = new FormData(document.getElementById("myForm")); 
    xhr.send(formData);
    
    createTableFromJSON(leaderJSON);
    console.log('leaderboard ought to have been generated');
}



function createTableFromJSON(leaderJSON) {
    let col = [];
    for (let i = 0; i < leaderJSON.length; i++) {
      for (let key in leaderJSON[i]) {
        if (col.indexOf(key) ===-1) {
          col.push(key);
        }
      }
    }

    let table = document.createElement("table");

    let tr = table.insertRow(-1);

    for (let i = 0; i < col.length; i++) {
      let th = document.createElement("th");
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    for (let i = 0; i < leaderJSON.length; i++) {
      tr = table.insertRow(-1);
      for (let j = 0; j < col.length; j++) {
        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = leaderJSON[i][col[j]];
      }
    }

    let divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}



// DB Interface Functions

function get_leaders(path, params, target, method) {  
  console.log('inside the get_leaderboard function');
  const form_leaders_db = document.createElement('form');
  form_leaders_db.action = path;
  form_leaders_db.target = target;
  form_leaders_db.method = method;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];
      form_leaders_db.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form_leaders_db);
  form_leaders_db.submit();
}