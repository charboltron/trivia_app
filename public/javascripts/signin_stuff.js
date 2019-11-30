document.getElementById("btnsignin").onclick = function() { setSignIn() };

function resetSignIn(){

    user_name = '';
    console.log(`resetting signed in user on client side to: ${user_name}`);
    localStorage.setItem('userSignedIn', user_name);

}

function setSignIn(){

    var user_name = document.getElementById("user_name").value;
    console.log(`setting signed in user on client side to: ${user_name}`);
    // alert(`setting signed in user on client side to: ${user_name}`)
    localStorage.setItem('userSignedIn', user_name);
    document.getElementById("hidden_button_sign_in_user").click();
}
