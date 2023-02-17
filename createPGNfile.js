/*
[Event "?"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]

1. h3 e5 2. b3 d5 *

[Event "World Chess Championship"]
[Site "London, UK"]
[Date "2018.11.12"]
[Round "1"]
[White "Carlsen, Magnus"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Na5 10.Bc2 c5 11.d4 Qc7 12.Nbd2 Bd7 13.Nf1 Rfe8 14.Ng3 g6 15.b3 Rac8 16.d5 c4 17.b4 Nb7 18.a4 Ra8 19.Be3 Reb8 20.Ra2 Qc8 21.Qa1 Ne8 22.Qb2 Nd8 23.Rea1 Ng7 24.Qc1 f6 25.Nh2 Nf7 26.Bd1 Bd8 27.Bg4 f5 28.exf5 gxf5 29.Bh5 Nxh5 30.Nxh5 f4 31.Bxf4 exf4 32.Qxf4 Bf5 33.Re2 Bg5 34.Qg3 Bg6 35.Nf4 Bxf4 36.Qxf4 Qf5 37.Qxf5 Bxf5 38.Nf3 Re8 39.Rxe8+ Rxe8 40.axb5 axb5 41.Nd4 Bd7 42.Ra7 Re1+ 43.Kh2 Be8 44.Ra8 Kf8 45.Nxb5 Re5 46.Nc7 Re7 47.Nb5 Re5 48.Nc7 Re7 49.Nb5 Kg7 50.Nd4 Bd7 51.Ra7 Kf6 52.f4 h5 53.Rc7 h4 54.Rxc4 Re4 55.Rc7 Ba4 56.b5 Rxf4 57.b6 Rf1 58.Rc4 Bd7 59.Rb4 Bc8 60.Rc4 Ba6 61.Ra4 Bc8 62.Rc4 Ba6 63.Ra4 Bc8 1/2-1/2
*/
function createPGN(){
    document.getElementById("pngDisplayer").style.display = "block";

    let textarea = document.createElement('textarea');
    document.getElementById("pngmaindisplay").appendChild(textarea);

    let string = "[Event \"?\"]\n[Site \"?\"]\n[Date \"????.??.??\"]\n[Round \"?\"]\n[White \"?\"]\n[Black \"?\"]\n[Result \"*\"]\n";
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