document.getElementById("delete_my_account").onclick = function() { delete_user() };

function checkIfSignedIn(){
    //doesn't do anything yet
    console.log('checking if signed in');
    var user_to_delete = localStorage.getItem('userSignedIn');
    if(!user_to_delete){
        alert(`You are not signed in! Please sign in to delete your account`);
        document.getElementById("return_home").click();
    }
    console.log(`You are signed in as: ${user_to_delete}`);
    document.getElementById("display_user_name").innerHTML = 
    `Warning! You are currently signed in as ${user_to_delete}. Deleting your account is irreversible!`;
}

function delete_user(){

    document.getElementById("hidden_delete_account_button").click();
    localStorage.setItem('userSignedIn', '');

}


