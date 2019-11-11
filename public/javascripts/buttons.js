function guess_answer(button_id){
    var guess_letter;
    switch(button_id){
        case "guess_A":
            guess_letter = "A";
            break;
            case "guess_B":
            guess_letter = "B";
            break;
            case "guess_C":
            guess_letter = "C";
            break;
            case "guess_D":
            guess_letter = "D";
            break;
        default:
            guess_letter="None"; //??
    }
    console.log(`${guess_letter} button was pressed`);
}