class Board{
    constructor(file,rank,piece,color){
        this.file = file;
        this.rank = rank;
        this.piece = null;
        this.color = color;
        this.boardPrefab = this.DrawSquare(color);
    }

    DrawSquare(color){
        let square = document.createElement('div');
        square.classList.add(color+"Square","Square");
        square.style.width = 100/8 + "%";
        square.id = this.file+","+this.rank;
        document.getElementById("GameCanvas").appendChild(square);
        return square;
    }
}

class Piece{
    constructor (file, rank ,piece ,color){
        this.piece = piece;
        this.color = color;
        this.file = file;
        this.rank = rank;
        this.PieceImg = this.drawPiece();
        this.addPieceToBoard();
        this.addEventListnerToEachPiece(this);
    }

    drawPiece() {
        let colorOfPiece = (this.color == "White")? "w":"b";
        let pieceType = {"Pawn":"p","Rook":"r","Bishop":"b","Knight":"n","King":"k","Queen":"q"};
        let img = document.createElement('img');
        img.classList.add("Piece");
        img.src = "sprites/"+(colorOfPiece)+(pieceType[this.piece])+".png";
        document.getElementById(this.file+","+this.rank).appendChild(img);
        return img;
    }
    
    get PieceColor(){
        return this.color;
    }

    get PieceName(){
        return this.piece;
    }

    //Check if the CheckPiece is of same Type
    IsType(pieceName){
        if(this.PieceName == checkPiece) return true;
        else return false;
    }

    //Check if the color of the checkPieces is same as the current Piece
    IsColor(color){
        if(this.color == color) return true;
        else return false;
    }

    //Check if the piece is sliding Piece
    get isSlidingPiece(){
        if(this.piece=="Bishop" || this.piece=="Queen" || this.piece=="Rook"){
            return true;
        }
        else{
            false;
        }
    }

    get isKnightPiece(){
        if(this.piece=="Knight"){
            return true;
        }
        else{
            false;
        }
    }

    get isKingPiece(){
        if(this.piece=="King"){
            return true;
        }
        else{
            false;
        }
    }

    get isPawnPiece(){
        if(this.piece=="Pawn"){
            return true;
        }
        else{
            false;
        }
    }

    changePieceLocation(file,rank,move){
        
        if(Square[file][rank].piece!=null){
            this.AttackPiece(Square[file][rank].piece)
        }
        
        Square[this.file][this.rank].piece = null;
        this.file = file;
        this.rank = rank;   
        document.getElementById(file+","+rank).append(this.PieceImg);
        Square[this.file][this.rank].piece = this;
        //Change Player Turn
        changeTurnFunction();
        
        removeHighlightedCircles();
    }

    addPieceToBoard(){
        this.PieceImg.style.display = "block";
        Square[this.file][this.rank].piece = this;
        Pieces.push(this);
    }

    addEventListnerToEachPiece(Piece){
        Piece.PieceImg.addEventListener("click", function() {
            
            Piece.selectingPieceToMove();
            
        });
    }

    AttackPiece(piece){
        let index = Pieces.indexOf(piece);
        Pieces.splice(index,1);
        piece.PieceImg.style.display = "none";
        fiftyMoveRule = 0;
    }

    selectingPieceToMove(){
        let Piece = this;
        let steps = [];
        if(Piece.color == PlayerTurn){
                
            //Yellow Color Over The Clicked Piece;
            Piece.ColorThePiecesLocationOnMove();

            let legalMoves = GenerateLegalMoves();

            legalMoves.forEach(moves => {
                if(moves.piece == Piece){
                    steps.push(moves);
                }
            });
            DisplaySteps(steps,Piece);
        }
    }

    ColorThePiecesLocationOnMove(){
        if(ClickedPiece!=null){
            ClickedPiece.boardPrefab.style.backgroundColor = "";
        }
        if(PrevLocationOfClickedPiece!=null){
            PrevLocationOfClickedPiece.boardPrefab.style.backgroundColor = "";
        }
        ClickedPiece = Square[this.file][this.rank];
        ClickedPiece.boardPrefab.style.backgroundColor =  (ClickedPiece.color=="Black") ? "rgb(186, 202, 43)" : "rgb(246, 246, 105)";
    }
}

class Move{
    constructor(startSquare, targetSquare){
        this.piece = startSquare.piece;
        this.startSquare = startSquare;
        this.targetSquare = targetSquare;
        this.AttackedPiece = null;
        if(this.targetSquare != null){
            this.AttackedPiece = this.targetSquare.piece;
        }
    }

    isEqual(otherPiece) {
        return (
            this.piece === otherPiece.piece &&
            this.startSquare === otherPiece.startSquare &&
            this.targetSquare === otherPiece.targetSquare &&
            this.AttackedPiece === otherPiece.AttackedPiece
        );
    }
}

let startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kkq - 0 1";

let PlayerTurn = null;

let Square = new Array(8);
let Pieces = [];

let CheckMate = false;
let Stalemate = false;
let checked = false;
let fiftyMoveRule = 0;

const higligtedMovesVisualizer = [];

let aiSpeed = 100;

let CheckBoardPiece = {"Black":null,"White":null};

let ClickedPiece = null;
let PrevLocationOfClickedPiece = null;

init();
function init(){
    FenRetrieveFromUrl();
    PlayerTurn = (startFen.split(" ")[1] == "w")? "White" : "Black";
    CreateGraphicalBoard();
    loadPositionFromFen(startFen);
    if(GenerateLegalMoves()<=0){
        if(checked){
            CheckMate = true;
            console.log(PlayerTurn+" Checkmate");
            document.getElementById("win_msg").textContent = "Checkmate : "+returnTurnOppositeColor()+" Wins";
            document.getElementById("Checkmate-Screen").style.display = "flex";
        }else{
            console.log("Stalemate");
            document.getElementById("win_msg").textContent = "Stalemate : Draw";
            document.getElementById("Checkmate-Screen").style.display = "flex";
        }
    }
}

function CreateGraphicalBoard(){
    for(let file = 0; file < 8; file++){
        Square[file] = new Array(8);
        for(let rank = 0; rank < 8; rank++){
            let isLightColor = (file + rank) % 2 != 0;

            var squareColor = (isLightColor) ? "White" : "Black";

            Square[file][rank] = new Board(file,rank,null,squareColor);
        }
    }
}

function loadPositionFromFen(fen){
    let fenBoard = fen.split(" ")[0];
    let file=0;let rank=0;
    for(i=0;i<fenBoard.length;i++){
        symbol=fenBoard[i];
        if(symbol=='/'){
            file=0;rank++;
        }else{
            if(isNumber(symbol)){
                file+=parseInt(symbol);
            }else{
                let pieceColor = (symbol===symbol.toUpperCase()) ? "White":"Black";
                let pieceType = symbol.toLowerCase();
                let piece = {"p":"Pawn","r":"Rook","b":"Bishop","n":"Knight","k":"King","q":"Queen"};
                piece = new Piece(rank,file,piece[pieceType],pieceColor);
                file++;
            }
        }
    }
}

function isNumber(char) {
    if (typeof char !== 'string') {
      return false;
    }
    if (char.trim() === '') {
      return false;
    }
    return !isNaN(char);
}

function GenerateSlidingMoves(startRow, startCol, detectItsOwnColor){
    const startSquare = Square[startRow][startCol];

    let piece = startSquare.piece;

    let startDirIndex = (piece.PieceName == "Bishop") ? 4 : 0;
    let endDirIndex = (piece.PieceName == "Rook") ? 4 : 8;

    const steps = [];

    const rowDirections = [1, -1, 0, 0, 1, 1, -1, -1];
    const colDirections = [0, 0, 1, -1, 1, -1, 1, -1];

    for(let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++){
        let row = startRow + rowDirections[directionIndex];
        let col = startCol + colDirections[directionIndex];
        while (row >= 0 && row < 8 && col >= 0 && col < 8) {
                       
            const targetSquare = Square[row][col];
            const pieceOnTargetSquare = targetSquare.piece;

            if(detectItsOwnColor){
                if (pieceOnTargetSquare != null && pieceOnTargetSquare.PieceColor == piece.PieceColor) {
                    break;
                }
                steps.push(new Move(startSquare, targetSquare));
                
                if (pieceOnTargetSquare != null && pieceOnTargetSquare.PieceColor != piece.PieceColor) {
                    break;
                }
            }else{
                steps.push(new Move(startSquare, targetSquare));
                
                if (pieceOnTargetSquare != null) {
                    break;
                }
            }
                       

            row += rowDirections[directionIndex];
            col += colDirections[directionIndex];
        }
    }
    return steps;
}

function GenerateSlidingMovesForKing(startRow, startCol, detectItsOwnColor){

    const startSquare = Square[startRow][startCol];

    let piece = startSquare.piece;

    const steps = [];

    const rowDirections = [1, -1, 0, 0, 1, 1, -1, -1];
    const colDirections = [0, 0, 1, -1, 1, -1, 1, -1];

    for(let directionIndex = 0; directionIndex < 8; directionIndex++){
        let row = startRow + rowDirections[directionIndex];
        let col = startCol + colDirections[directionIndex];
        let n = 0;
        while (row >= 0 && row < 8 && col >= 0 && col < 8 && n<1) {
                       
            n++;
            const targetSquare = Square[row][col];
            const pieceOnTargetSquare = targetSquare.piece;
            if(detectItsOwnColor){
                
                if (pieceOnTargetSquare != null && pieceOnTargetSquare.PieceColor == piece.PieceColor) {
                    break;
                }
                steps.push(new Move(startSquare, targetSquare));
                
                if (pieceOnTargetSquare != null && pieceOnTargetSquare.PieceColor != piece.PieceColor) {
                    break;
                }
            }else{
                steps.push(new Move(startSquare, targetSquare));
                
                if (pieceOnTargetSquare != null) {
                    break;
                }
            }

            row += rowDirections[directionIndex];
            col += colDirections[directionIndex];
        }
    }
    return steps;
}  

function GenerateKnightMoves(startRow, startCol, detectItsOwnColor){
    const startSquare = Square[startRow][startCol]; 
    let piece = startSquare.piece;

    files=startRow;
    ranks = startCol;
    const steps = [];
    const potentialMoves = [    [files + 2, ranks + 1],
        [files + 2, ranks - 1],
        [files - 2, ranks + 1],
        [files - 2, ranks - 1],
        [files + 1, ranks + 2],
        [files + 1, ranks - 2],
        [files - 1, ranks + 2],
        [files - 1, ranks - 2]
    ];

    for (const move of potentialMoves) {
        const [newX, newY] = move;
        if(newX >= 0 && newX < 8 && newY >=0 && newY < 8){

            const targetSquare = Square[newX][newY];
            const pieceOnTargetSquare = targetSquare.piece;

            if(detectItsOwnColor){
                if(pieceOnTargetSquare==null){
                    steps.push(new Move(startSquare, targetSquare));
                }
                else if(pieceOnTargetSquare.PieceColor != piece.PieceColor){
                    steps.push(new Move(startSquare, targetSquare));
                }
            }else{
                steps.push(new Move(startSquare, targetSquare));
            }
        }
    }
    return steps;
}

function GeneratePawnMoves(startRow, startCol, detectItsOwnColor){
    const startSquare = Square[startRow][startCol];

    let piece = startSquare.piece;

    const steps = [];

    const moveDir = (piece.color == "White") ? -1 : 1;
    
    let row = startRow+(moveDir);
    let col = startCol;
    let k=1;
    let max = ((piece.color == "Black" && piece.file == 1) || (piece.color == "White" && piece.file == 6))? 2:1;
    if(detectItsOwnColor){
        while(row >= 0 && row < 8 && k<=max){
            k++;
            const targetSquare = Square[row][col];
            const pieceOnTargetSquare = targetSquare.piece;
            if(pieceOnTargetSquare==null){
                steps.push(new Move(startSquare, targetSquare));
            }else{
                break;
            }
            row=startRow+(moveDir*k);
        }
    }

    const colDir = [1,-1];
    for(let i = 0; i < 2; i++){
        
        const rows = startRow+moveDir;
        const cols = startCol+colDir[i];

        if(rows>=0 && rows<8 && cols>=0 && cols<8){
            
            const targetSquare = Square[rows][cols];
            const pieceOnTargetSquare = targetSquare.piece;
            
            if(detectItsOwnColor){
                if(pieceOnTargetSquare!=null && pieceOnTargetSquare.PieceColor != piece.PieceColor){
                    steps.push(new Move(startSquare, targetSquare));
                }
            }else{
                steps.push(new Move(startSquare, targetSquare));
            }
        }
    }
    
    return steps;
}

function DisplaySteps(steps,piece){
    
    removeHighlightedCircles();

    steps.forEach(eachStep => {
        let boardPrefab = eachStep.targetSquare.boardPrefab;

        let circle = document.createElement('div');
        circle.classList.add((eachStep.AttackedPiece==null)?"Circles":"AttackCircles");
        boardPrefab.appendChild(circle);

        circle.addEventListener("click", function() {
            MoveOnClick(eachStep,piece);
        });

        higligtedMovesVisualizer.push(circle);
    });
}

function MoveOnClick(eachStep,piece){

    showPlayedMoves(eachStep);

    if(piece.piece=="Pawn"){
        fiftyMoveRule = 0;
    }else{
        fiftyMoveRule++;
    }


    piece.changePieceLocation(eachStep.targetSquare.file, eachStep.targetSquare.rank, eachStep);

    //Promotion
    Promotion(piece);
    
    //Adding Color if Check
    for(let k = 0; k < 2; k++ ){
        if(CheckBoardPiece[(k==0)?"Black":"White"]!=null){
            CheckBoardPiece[(k==0)?"Black":"White"].boardPrefab.classList.remove("CheckSquare");
            CheckBoardPiece[(k==0)?"Black":"White"]=null;
        }
    }

    CheckForCheck();
    if(GenerateLegalMoves()<=0){
        //Checkmate Win
        if(checked){
            CheckMate = true;
            console.log(PlayerTurn+" Checkmate");
            document.getElementById("win_msg").textContent = "Checkmate : "+returnTurnOppositeColor()+" Wins";
            document.getElementById("Checkmate-Screen").style.display = "flex";
        }
        //Stalemate Draw
        else{
            console.log("Stalemate");
            document.getElementById("win_msg").textContent = "Stalemate : Draw";
            document.getElementById("Checkmate-Screen").style.display = "flex";
        }
    }
    //Fifty Move Rule Check Draw
    if(fiftyMoveRule >= 100){
        console.log("Fifty Move Rule");
        document.getElementById("win_msg").textContent = "Fifty Move Rule : Draw";
        document.getElementById("Checkmate-Screen").style.display = "flex";
    }

    //Yellow Color Over The Clicked Piece;
    if(PrevLocationOfClickedPiece!=null){
        PrevLocationOfClickedPiece.boardPrefab.style.backgroundColor = "";
    }
    PrevLocationOfClickedPiece = Square[piece.file][piece.rank];
    PrevLocationOfClickedPiece.boardPrefab.style.backgroundColor = (PrevLocationOfClickedPiece.color=="Black") ? "rgb(186, 202, 43)" : "rgb(246, 246, 105)";

    checked = false;
}

function removeHighlightedCircles(){
    higligtedMovesVisualizer.forEach(eachStep => {
        eachStep.remove();
    });
    higligtedMovesVisualizer.length = 0;
}

function changeTurnFunction(){
    PlayerTurn = (PlayerTurn == "White")? "Black" : "White";
}

function returnTurnOppositeColor(){
    return (PlayerTurn == "White")? "Black" : "White";
}

function newUnmakeMove(move){
    if(move!=null){
        move.piece.changePieceLocation(move.startSquare.file,move.startSquare.rank,move);
        if(move.AttackedPiece!=null){
            //let piece = new Piece(move.AttackedPiece.file, move.AttackedPiece.rank, move.AttackedPiece.piece, move.AttackedPiece.color);
            //console.log(move.AttackedPiece);
            move.AttackedPiece.addPieceToBoard();

        }
        move = null;
    }
}

function GenerateMoves(){
    let moves = [];
    for(let startSquare = 0; startSquare < Pieces.length; startSquare++){
        let piece = Pieces[startSquare];
        if(piece.IsColor(PlayerTurn)){

            if(piece.isSlidingPiece){
                let steps = GenerateSlidingMoves(piece.file,piece.rank,true);
                moves.push(steps);
            }

            if(piece.isKingPiece){
                let steps = GenerateSlidingMovesForKing(piece.file,piece.rank,true);
                moves.push(steps);
            }

            if(piece.isKnightPiece){
                let steps = GenerateKnightMoves(piece.file,piece.rank,true);
                moves.push(steps);
            }

            if(piece.isPawnPiece){
                let steps = GeneratePawnMoves(piece.file,piece.rank,true);
                moves.push(steps);
            }
        }
    }

    let enhance = [];
    moves.forEach(move => {
        if(move.length>0){
            if(move.length>0){
                move.forEach(eachmove => {
                    enhance.push(eachmove);
                });
            }
        }
    });
    moves=enhance;

    return moves;
}

function GenerateLegalMoves(){
    let pseudoLegalMoves = GenerateMoves();
    let legalMoves = [];


    
    let prevFiftyMoveRuleValue = fiftyMoveRule;
    
    pseudoLegalMoves.forEach(moveToVerify => {
        moveToVerify.piece.changePieceLocation(moveToVerify.targetSquare.file,moveToVerify.targetSquare.rank,moveToVerify);
        let bool = false;
        
        let opponnentResponses = GenerateMoves();
        opponnentResponses.forEach(element => {
            if(element.targetSquare.piece!=null && element.AttackedPiece.piece == "King"){
                bool = true;
            }
        });

        if(!bool){
            legalMoves.push(moveToVerify);
        }
        newUnmakeMove(moveToVerify);
        
    });
    let intersection1 = pseudoLegalMoves.filter(x => !legalMoves.includes(x));
    fiftyMoveRule = prevFiftyMoveRuleValue;
    return legalMoves;
}

function Promotion(piece){
    if(piece.piece == "Pawn"){
        let checkfile = (piece.color == "White") ? 0 : 7;
        if(piece.file == checkfile){
            chooseChessPiece(piece);
        }
    }
}

//Not Implemented Castling
let castlingAvailability = {'K': false,'Q': false,'k': false,'q': false};
function checkForCastling(fen) {
    let castlingPart = fen.split(' ')[2];
    if (castlingPart === '-') {
        return castlingAvailability;
    }
    for (let i = 0; i < castlingPart.length; i++) {
        castlingAvailability[castlingPart[i]] = true;
    }
}

function GenerateThreatMaps(){
    //Generating All The possible attack Positions by the Opposite Player
    let moves = [];
    for(let startSquare = 0; startSquare < Pieces.length; startSquare++){
        let piece = Pieces[startSquare];
        if(piece.IsColor(returnTurnOppositeColor())){

            if(piece.isSlidingPiece){
                let steps = GenerateSlidingMoves(piece.file,piece.rank,false);
                moves.push(steps);
            }

            if(piece.isKingPiece){
                let steps = GenerateSlidingMovesForKing(piece.file,piece.rank,false);
                moves.push(steps);
            }

            if(piece.isKnightPiece){
                let steps = GenerateKnightMoves(piece.file,piece.rank,false);
                moves.push(steps);
            }

            if(piece.isPawnPiece){
                let steps = GeneratePawnMoves(piece.file,piece.rank,false);
                moves.push(steps);
            }
        }
    }
    let enhancedMoves = [];
    moves.forEach(move => {
        if(move.length>0){
            move.forEach(eachmove => {
                if(eachmove.AttackedPiece!=null && eachmove.AttackedPiece.color!=returnTurnOppositeColor()){
                    enhancedMoves.push(eachmove);
                }
            });
        }
    });
    moves = enhancedMoves;
    return moves;
}

function CheckForCheck(){
    let moves = GenerateThreatMaps();
    moves.forEach(element => {
        if(element.AttackedPiece.piece == "King" && element.AttackedPiece.color == PlayerTurn){
            console.log(PlayerTurn+" Check");
            checked = true;
            element.targetSquare.boardPrefab.classList.add("CheckSquare");
            CheckBoardPiece[PlayerTurn] = element.targetSquare;
        }
    });
}

async function chooseChessPiece(piece) {
    if(!ai){
        var promotionChoice = document.getElementById("promotion-choice");
        var selectedPiece = null;
      
        var queenButton = document.getElementById("queen-button");
        queenButton.addEventListener("click", function() {
          selectedPiece = "Queen";
          promotionChoice.style.display = "none";
        });
      
        var rookButton = document.getElementById("rook-button");
        rookButton.addEventListener("click", function() {
          selectedPiece = "Rook";
          promotionChoice.style.display = "none";
        });
      
        var bishopButton = document.getElementById("bishop-button");
        bishopButton.addEventListener("click", function() {
          selectedPiece = "Bishop";
          promotionChoice.style.display = "none";
        });
      
        var knightButton = document.getElementById("knight-button");
        knightButton.addEventListener("click", function() {
          selectedPiece = "Knight";
          promotionChoice.style.display = "none";
        });
      
        promotionChoice.style.display = "flex";
        
        while (!selectedPiece) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
    
        Pieces.splice(Pieces.indexOf(piece),1);
        piece.PieceImg.style.display = "none";
    
        let newPiece = new Piece(piece.file, piece.rank, selectedPiece, piece.color);
    }
    else{
        Pieces.splice(Pieces.indexOf(piece),1);
        piece.PieceImg.style.display = "none";
        let newPiece = new Piece(piece.file, piece.rank, "Queen", piece.color);
    }
}  







//Random Moves AI
let ai = false;
function MoveAutomatically(){
    if(!CheckMate && !Stalemate && fiftyMoveRule<100){
        ai = true;

        //
        setTimeout(function() {
            MoveAutomatically();
        }, aiSpeed);

        let availableMoves = GenerateLegalMoves();

        let selectRandomMove = availableMoves[getRandomNumber(0,availableMoves.length-1)];
        selectRandomMove.piece.ColorThePiecesLocationOnMove();
        MoveOnClick(selectRandomMove,selectRandomMove.piece);
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}










//HTML
function FenRetrieveFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const fen = urlParams.get('fen');
    if(fen!=null){
        startFen = fen;
        return;
    }
    startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
}

function RestartGame(){
    let link = window.location.href.split("?")[0];
    window.location = link;
}

function AnalayseGame(){
    document.getElementById("Checkmate-Screen").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById("mySlider");
    const sliderValue = document.getElementById("sliderValue");
  
    sliderValue.innerHTML = slider.value;
  
    slider.oninput = function() {
      sliderValue.innerHTML = this.value;
      aiSpeed = this.value
    }
});


let movesCounter = 0;
const playedMoves = [];
const table = document.getElementById("tableMoves");
function showPlayedMoves(move){
    if(PlayerTurn == "White"){
        movesCounter++;
        
        let row = document.createElement('tr');
        row.classList.add("movesRow");
        row.id = "movesRow"+movesCounter;
        
        let Rowno = document.createElement('td');
        let Row1stMove = document.createElement('td');
        let Row2stMove = document.createElement('td');

        row.appendChild(Rowno);
        row.appendChild(Row1stMove);
        row.appendChild(Row2stMove);

        table.appendChild(row);

        createCellsForMoves(movesCounter+". ");
    }
    //display moves
    let alphaValuesRank = ["a","b","c","d","e","f","g","h"];
    let alphaValuesFile = ["8","7","6","5","4","3","2","1"];
    let pieceValues = {"Pawn":"","Rook":"R","Bishop":"B","Knight":"N","Queen":"Q","King":"K"};

    if(move.AttackedPiece == null){
        let text = (pieceValues[move.piece.piece] + alphaValuesRank[move.targetSquare.rank] + (alphaValuesFile[move.targetSquare.file]) + " ");
        createCellsForMoves(text);
    }
    else{
        if(move.piece.piece == "Pawn"){
            text = (alphaValuesRank[move.startSquare.rank] + "x" + alphaValuesRank[move.targetSquare.rank] + (alphaValuesFile[move.targetSquare.file]) + " ");
            createCellsForMoves(text);
        }
        else{
            text = (pieceValues[move.piece.piece] + "x" + alphaValuesRank[move.targetSquare.rank] + (alphaValuesFile[move.targetSquare.file]) + " ");
            createCellsForMoves(text);
        }
    }
}
function createCellsForMoves(text){
    let rowChilds = document.getElementById("movesRow"+movesCounter).childNodes;
    let cell = null;
    if(rowChilds[0].textContent == ""){
        cell = rowChilds[0];
    }else if(rowChilds[1].textContent == ""){
        cell = rowChilds[1];
    }
    else{
        cell = rowChilds[2];
    }
    playedMoves.push(text);
    cell.classList.add("movesCol");
    cell.textContent = text;
}
  





//Proper AI
/*
const pawnValue = 1;
const knightValue = 3;
const bishopValue = 3;
const rookValue = 5;
const queenValue = 9;
const kingValue = 90;

console.log(Evaluate());

function Evaluate(){
    let whiteEval = CountMaterial("White");
    let blackEval = CountMaterial("Black");

    let evaluation = whiteEval - blackEval;

    let perspective = (PlayerTurn == "White") ? 1 : -1;
    return evaluation * perspective;
}

function CountMaterial(color){
    let material = 0;
    Pieces.forEach(piece => {
        if(piece.color == color){
            switch (piece.piece) {
                case "Pawn":material+=pawnValue;break;
                case "Knight":material+=knightValue;break;
                case "Bishop":material+=bishopValue;break;
                case "Rook":material+=rookValue;break;
                case "Queen":material+=queenValue;break;
            }
        }
    });

    return material;
}
*/