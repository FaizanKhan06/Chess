function FenSubmit(){
    fen = document.getElementById("fen_Input").value;
    let link = window.location.href.split("?")[0];
    if(isValidFEN(fen)){
        window.location = link+"?fen="+fen;
    }
    else{
        document.getElementById("invalidFen").style.display="block";
        setTimeout(function() {
            document.getElementById("invalidFen").style.display="none";
        }, 3000);
    }
}

function isValidFEN(fen) {
    const parts = fen.split(" ");
    if (parts.length !== 6) {
      console.log("Error: Invalid number of parts");
      return false;
    }
  
    const rows = parts[0].split("/");
    if (rows.length !== 8) {
      console.log("Error: Invalid number of rows");
      return false;
    }
  
    for (const row of rows) {
      let count = 0;
      for (const char of row) {
        if (!isNaN(char)) {
          count += parseInt(char);
        } else if (char.toLowerCase() === char || char.toUpperCase() === char) {
          count++;
        } else {
          console.log("Error: Invalid character in row");
          return false;
        }
      }
      if (count !== 8) {
        console.log("Error: Invalid row length");
        return false;
      }
    }
  
    if (parts[1] !== "w" && parts[1] !== "b") {
      console.log("Error: Invalid active color");
      return false;
    }
    if (!/^[KQkq-]+$/.test(parts[2])) {
      console.log("Error: Invalid castling availability");
      return false;
    }
    if (!/^(-|[a-h][36])$/.test(parts[3])) {
      console.log("Error: Invalid en passant target square");
      return false;
    }
    if (!/^\d+$/.test(parts[4])) {
      console.log("Error: Invalid halfmove clock");
      return false;
    }
    if (!/^\d+$/.test(parts[5])) {
      console.log("Error: Invalid fullmove number");
      return false;
    }
  
    return true;
}


/*
Some Popular Fen

Upper Case: White
Lower Case: Black

1.Starting Position: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

        R  N  B  Q  K  B  N  R
        P  P  P  P  P  P  P  P
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
        p  p  p  p  p  p  p  p
        r  n  b  q  k  b  n  r

2.Schliemann Defense: rnbqkb1r/pp2pppp/2p2n2/3p4/3P4/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 5

        R  N  B  Q  K  B  .  R
        P  P  .  .  P  P  P  P
        .  .  P  .  .  N  .  .
        .  .  .  P  .  .  .  .
        .  .  .  p  .  .  .  .
        .  .  n  .  .  n  .  .
        p  p  p  .  p  p  p  p
        r  .  b  q  k  b  .  r

3.King's Gambit: rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2

        R  N  B  Q  K  B  N  R
        P  P  P  .  P  P  P  P
        .  .  .  .  .  .  .  .
        .  .  .  P  .  .  .  .
        .  .  .  p  .  .  .  .
        .  .  .  .  .  .  .  .
        p  p  p  .  p  p  p  p
        r  n  b  q  k  b  n  r

4.Philidor Defense: rnbqkbnr/ppp1pppp/8/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR b KQkq - 0 2

        R  .  B  Q  K  B  N  R
        P  P  P  .  P  P  P  P
        .  .  .  .  .  .  .  .
        .  .  .  P  .  .  .  .
        .  .  .  p  .  .  .  .
        .  .  n  .  .  .  .  .
        p  p  p  .  p  p  p  p
        r  .  b  q  k  b  n  r

5.Stalemate Example: 6k1/8/5Q1K/8/8/8/8/8 w KQkq - 0 1
        .  .  .  .  .  .  K  .
        .  .  .  .  .  .  .  .
        .  .  .  .  .  q  .  k
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
        .  .  .  .  .  .  .  .
*/