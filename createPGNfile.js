function createPGN(){
    document.getElementById("pngDisplayer").style.display = "block";

    let textarea = document.createElement('textarea');
    document.getElementById("pngmaindisplay").appendChild(textarea);

    let string = "[Event \"Faizan's Chess Championship\"]\n[Site \"https://faizankhan06.github.io/Chess\"]\n[Date \"????.??.??\"]\n[Round \"?\"]\n[White \"?\"]\n[Black \"?\"]\n[Result \"*\"]\n";
    playedMoves.forEach(move => {
        string = string+move;
    });
    if(!CheckMate){
        string = string + "*";
    }
    textarea.textContent = string;

    textarea.readOnly = true;
}

function closePGNLayout(){
    document.getElementById("pngDisplayer").style.display = "none";
    let parent = document.getElementById("pngmaindisplay");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}