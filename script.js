const DEBUG_FLAG = false;
let globalChessGame = null;
const XFEN_START = [ 'br1', 'bn1', 'bb1', 'bq1', 'bk1', 'bb2', 'bn2', 'br2' ,     
                     'bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8' ,
                     '.',   '.',   '.',   '.',   '.',   '.',   '.',   '.' ,  
                     '.',   '.',   '.',   '.',   '.',   '.',   '.',   '.' ,  
                     '.',   '.',   '.',   '.',   '.',   '.',   '.',   '.' ,  
                     '.',   '.',   '.',   '.',   '.',   '.',   '.',   '.' ,  
                     'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8' ,
                     'wr1', 'wn1', 'wb1', 'wq1', 'wk1', 'wb2', 'wn2', 'wr2'
                   ];
const squareXlat = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',  //  R
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',  //
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',  //  A
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',  //
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',  //  N
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',  // 
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',  //  K
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'   // 
   ];  

// Sample PGN list
const samplePGN = `
[Event "Simple PGN"]
[xtraDet "Sample PGN"]

1. e4 f6 { B00 Barnes Defense } 2. Qh5+ g6 3. Qd1 { Black resigns. } 1-0

[Event "Problematic PGN with "." for xPiece at Turn 31"]
[xtraDet "Sample PGN"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. a3 Nf6 5. d3 O-O 6. h3 d6 7. Nc3
Nd4 8. Na4 Bb6 9. Nxb6 axb6 10. Ba2 Qe7 11. Be3 c5 12. c3 Ne6 13.
Qd2 h6 14. g4 g5 15. O-O-O Nf4 16. Rdg1 Rd8 17. h4 Kf8 18. hxg5 hxg5
19. Nxg5 Ke8 20. Bxf4 exf4 21. Bxf7+ Kd7 22. Qxf4 Kc6 23. Rh6 Nd7
24. Bd5+ Kb5 25. Rxd6 Rf8 26. Bc4+ Ka5 27. Rxd7 Bxd7 28. Qd2 b5 29.
b4+ cxb4 30. cxb4+ Kb6 31. Qe3+ Kc7 32. Bd5 Rxa3 33. Qd2 Ra1+ 34.
Kb2 Rxg1 35. Qc3+ Kb8 0-1

[Event "PGN with Enpassant and Promotion to Rook"]
[xtraDet "Sample PGN"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 b5 6. Bxb5 Qxd5 7.
Nxf7 Qxg2 8. Bxc6+ Qxc6 9. Nxh8 Qxh1+ 10. Ke2 Qe4+ 11. Kf1 Bh3+ 12.
Kg1 O-O-O 13. f3 Qb7 14. a4 Qxf3 15. Qxf3 Bd6 16. b4 Be6 17. d3 g6
18. Qc6 h5 19. b5 a5 20. bxa6 {enpass} g5 21. a7 g4 22. a8=R# {promo
to R with mate} 1-0

[Event "PGN from https://lichess.org/8fxcty8B"]
[xtraDet "Sample PGN"]
1. e4 e5 2. Nf3 b5 3. Bd3 b4 4. O-O g6 5. c4 bxc3 6. dxc3 Bg7 7. Na3
Ne7 8. b4 O-O 9. Nc4 d6 10. Ncxe5 dxe5 11. a4 Nbc6 12. Be3 Bg4 13.
Be2 Bxf3 14. Bxf3 Qxd1 15. Raxd1 Rfd8 16. Rxd8+ Rxd8 17. Bxa7 Ra8
18. Bc5 Bf8 19. a5 f5 20. Bxe7 Bxe7 21. h4 fxe4 22. Bxe4 Nd8 23.
Bxa8 c5 24. bxc5 Bxc5 25. Bd5+ Kg7 26. a6 Nf7 27. a7 Nh6 28. a8=N e4
29. c4 e3 30. Nc7 e2 31. Nb5 exf1=Q+ 32. Kh2 Qxf2 33. Nd6 Bxd6+ 34.
Kh3 Qg3# { Black wins by checkmate. } 0-1

[Event "PGN from https://lichess.org/7hQ58J9X#123"]
[xtraDet "Sample PGN"]
1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nf3 e6 6. Nc3 Nc6 7. c5
Be7 8. Bb5 O-O 9. Bxc6 bxc6 10. b4 a5 11. b5 cxb5 12. Nxb5 Ba6 13.
a4 Ne4 14. Qc2 f5 15. O-O Bf6 16. Rd1 Rb8 17. Bd2 Bxb5 18. axb5 Rxb5
19. Rdb1 Qd7 20. Rxb5 Qxb5 21. Rxa5 Qe2 22. Ra1 Qxf2+ 23. Kh1 Nxd2
24. Qxd2 Qxd2 25. Nxd2 Bxd4 26. Rc1 Be3 27. Rc2 Bxd2 28. Rxd2 Rc8
29. Rc2 Rc6 30. Kg1 Kf7 31. Kf2 e5 32. Ke3 Ke6 33. Kd3 Rc8 34. g3
Kd7 35. Rf2 g6 36. Rc2 Kc6 37. Ra2 Rb8 38. Ra6+ Kxc5 39. Ra7 Rb3+
40. Kc2 Rf3 41. Rxh7 Rf2+ 42. Kb3 Kd4 43. Rg7 e4 44. Rxg6 e3 45. Re6
e2 46. Kb4 Kd3 47. Kc5 d4 48. Kd5 Rf1 49. Re5 e1=Q 50. Rxe1 Rxe1 51.
h4 Re4 52. h5 Ke3 53. g4 Re8 54. gxf5 d3 55. Kd6 d2 56. Kd7 d1=Q+
57. Kxe8 Qd5 58. f6 Qe5+ 59. Kf7 Qxh5+ 60. Kg7 Qe5 61. Kg6 Qxf6+ 62.
Kxf6 1/2-1/2

[Event "PGN: Black Queen-side Castling (O-O-O), then rook moves (Example 1)"]
[xtraDet "Sample PGN"]
1. e4 d6 { B00 Pirc Defense } 2. Qh5 Qd7 3. h3 Qe6 4. Be2 Bd7 5. b3
Nc6 6. d3 O-O-O 7. Qg5 Re8 8. Bg4 { Black resigns. } 1-0

[Event "PGN: Black King-side Castling (O-O), then rook moves (Example 2)"]
[xtraDet "Sample PGN"]
1. e4 g6 { B06 Modern Defense } 2. f3 Nf6 3. Bc4 Bh6 4. Ne2 O-O 5.
Nd4 Re8 { Black resigns. } 1-0
[Event "PGN: White Queen-side Castling (O-O-O), then rook moves (Example 3)"]
[xtraDet "Sample PGN"]
1. d3 e5 { A00 Mieses Opening: Reversed Rat } 2. Qd2 d5 3. Nc3 Nf6
4. b4 Bxb4 5. Ba3 c5 6. O-O-O Nc6 7. Re1 Qa5 { White resigns. } 0-1
[Event "PGN: White King-side Castling (O-O), then rook moves (Example 4)"]
[xtraDet "Sample PGN"]
1. Nf3 f5 { A04 Zukertort Opening: Dutch Variation } 2. e3 Nc6 3.
Bd3 e5 4. O-O d6 5. Re1 { White resigns. } 0-1
`;
// let importedPGN = ``;
// let samplePGNArray = processMultiPGN(samplePGN);
// let ul = document.getElementById('pgn-list');
// samplePGNArray.forEach(item => {
//   let li = document.createElement('li');
//   li.textContent = item;
//   ul.appendChild(li);
// });

// ====================================================================================================================
// Helper Functions

function validatePGN(inputPGN) {   //PGN Validation logic
  const chessObj = new Chess();
  var isValidPGN = chessObj.load_pgn(inputPGN);
  if (isValidPGN) {
    return inputPGN;
  } else {
    return null;
  }
}

function formatPGN(pgnText) {
  // Remove any sequence of digits followed by a colon at the start of the PGN
  const pgnWithoutNumbers = pgnText.replace(/^\d+\:\s*/, '');

  // Extract the header section, assuming it's made up of square-bracketed tags
  const headerSection = pgnWithoutNumbers.match(/\[.*?\]/g);
  const headerFormatted = headerSection ? headerSection.join('\n') : '';

  // Remove the header section from the text, then trim whitespace and replace multiple spaces with single spaces
  const movesSection = pgnWithoutNumbers.replace(/\[.*?\]/g, '').trim().replace(/\s+/g, ' ');

  // If the header is present, include a blank line between the header and moves
  return headerFormatted ? `${headerFormatted}\n\n${movesSection}` : movesSection;
}


function processMultiPGN(inputString) {
  return inputString
    .split(/(?=\[Event )/g)
    .filter((item) => item.trim() !== ""); // Regex for detecting multiple PGNs, filter, then trim.
}

function processMovesAndTag(pgn) {
  // Returns an array with movetext (idx 0) and tagpairs (idx 1) of a single PGN
  const tagpairsRegex = /\[([^\]]+)\]/g; // Regex that matches lines that start and end with square brackets
  let moveText = pgn.replace(tagpairsRegex, "").trim().replace(/\n/g, "");
  let tagPair = [];
  let raw_tagpairs = pgn.match(tagpairsRegex) || []; // If no tagpair in PGN, return empty array
  if (raw_tagpairs != []) { // If tagpair exists, reduce it into an object with key-value pair.
    tagPair = raw_tagpairs.reduce((accumulator, item) => {
      const matches = item.match(/\[(\w+) "([^"]*)"\]/); // Regex parses each tagpair, and returns the key (idx = 1) and value (idx = 2)
      if (matches && matches.length > 2) {
        accumulator[matches[1]] = matches[2];
      }
      return accumulator;
    }, {});
  }
  return [moveText, tagPair];
}

function formatCells(cell_content) {
  let inner = "";
  if (cell_content.length <= 3) {
    inner =
      cell_content.substring(1, 2) +
      '<span class="supsub">' +
      "<sup>" +
      cell_content.substring(0, 1) +
      "</sup>" +
      "<sub>" +
      cell_content.substring(2, 3) +
      "</sub></span>";
    return inner;
  } else if (cell_content.length > 3) {
    return cell_content;
  }
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function display_xfen_debug(xfen) {
  // display xfen information in a consistant manner for debugging only
  let xpand = "";
  for (ix = 0; ix < xfen.length; ix++) {
    if (xfen[ix] == ".") {
      xpand = xpand + "...";
    } else {
      xpand = xpand + xfen[ix];
    }
    if ([7, 15, 23, 31, 39, 47, 55].includes(ix)) {
      xpand = xpand + "/";
    }
  }
  return xpand;
}

function squareCode2Idx(squareCode) {
  // accept A1..H8 and return the appropriate index value 0..63
  let lowercode = squareCode.toLowerCase();
  let localIx = squareXlat.indexOf(lowercode);
  return localIx;
}

function numberNewPiece(iPawn3) {
  // take a pawn 1..8 and return a code for its promoted counterpart 3,4,5,6,7,8,9,0
  let lnum = parseInt(iPawn3);
  lnum = lnum + 2;
  if (lnum > 9) {
    lnum = 0;
  }
  lnum = lnum.toString();
  return lnum;
}

// expands FEN information, example:   /4p3/ becomes ['.','.','.','.','p','.','.','.']
// and this process is done for all 8 RANKS and ignores the remaining portion of the FEN
function fen2array(ifen) {
  // get just piece placement portion
  let PIECES = "pnbrqkPNBRQK";
  var a2 = Array();
  var a1 = ifen.split(" ")[0].split("/"); //get 1st part of fen string which is the piece/board positions
  for (let i = 0; i <= 7; i++) {
    // for each RANK
    for (let k = 0; k < a1[i].length; k++) {
      // for each character in a RANK's fen part
      if (PIECES.includes(a1[i].charAt(k))) {
        a2.push(a1[i].charAt(k)); // keeps the PIECE char
      } else if ("12345678".includes(a1[i].charAt(k))) {
        var c = a1[i].charAt(k);
        var n = parseInt(c);
        for (let m = 1; m <= n; m++) {
          a2.push(".");
        } // expands 1..8 to that count of spaces
      }
    }
  }
  return a2;
}

// ====================================================================================================================
//   A chess game instance
//   When created this object digests a PGN and populates a series of arrays that
//   are indexed by the game turn/ply
function ChessGame(ipgn) {

  if (ipgn == null) {
    return null;
  }
  
  // ipgn = input PGN ; tpgn = trimmed PGN
  let tpgn = ipgn.trim()
  let move_and_tagpair = processMovesAndTag(tpgn);
  this.pgn_movetext = move_and_tagpair[0];
  this.pgn_tagpair = move_and_tagpair[1];

  this.fens = []; // holding the fens from the digested pgn
  let efens = []; // expanded fens as an array with full spaces as '.'
  this.xfens = []; // expanded fens as array with colors and piece numbers 'wp4'
  this.removed = [""]; // array, indexed by turn/ply indicating what was captured or promoted
  this.history = []; // verbose history returned by chess.js.history

  // workers used in the construction of the ChessGame object
  // chess1 holds the digested pgn and chess2 is used to walk the moves and extract the fens

  let chess1 = new Chess();
  let chess2 = new Chess();
  let startPos = chess2.fen();
  let posIdx = 0;
  let fen = ""; // fen string
  let efen = ""; // fen string with blanks
  let xfen_prev = ""; // xfen string as efen but including colors and numbers, _p = prior
  let xfen_curr = ""; // fen string as efen but including colors and numbers, _c = current
  let promoted = "";

  let ascii = "";

  // =====  initialize the worker objects  =====
  chess1.load_pgn(tpgn);
  chess2.load_pgn("");

  // the JSON syntax here is for doing a DEEP copy of an array of strings
  // might be overkill but works for now
  xfen_prev = JSON.parse(JSON.stringify(XFEN_START));
  this.xfens.push(xfen_prev); //push the starting efens array into the efens array


  // ====================================================================================
  // #####     the first pass over history just to get all FEN information
  // #####     which is pushed into the efens array
  // ====================================================================================
  this.fens = chess1.history().map((move) => {
    chess2.move(move);
    fen = chess2.fen;
    efen = fen2array(chess2.fen());
    efens.push(efen);
    return chess2.fen();
  });

  let local_ix = 0; //this aligns with the TURN/PLY but starts at 0
  // ====================================================================================
  // =====  walk the game history again to get to:, fr:, and san: detail
  // =====  and also to expand the fens to xfens which includes colors and numbers
  // ====================================================================================

  this.history = chess1.history({ verbose: true }).map((map_obj) => {
    if (DEBUG_FLAG) {
      console.log("turn : ", local_ix + 1);
    }
    if (DEBUG_FLAG) {
      console.log(
        map_obj.color,
        map_obj.piece,
        map_obj.from,
        map_obj.to,
        map_obj.san
      );
    }

    // let sanTest = map_obj.san.toLowerCase()
    // if (sanTest.includes('o-o')) {
    //   debugger
    // }

    efen = efens[local_ix];

    // make a deep copy of the xfen_p to modify
    xfen_curr = JSON.parse(JSON.stringify(xfen_prev));

    // square by square blank out any that are now '.'
    for (ix = 0; ix < 64; ix++) {
      if (efens[local_ix][ix] == ".") {
        xfen_curr[ix] = ".";
      }
    }
  
    let lpiece = map_obj.piece.toLowerCase();
    let ppiece = ""; // have both lpiece and ppiece because ppiece is the piece prior to promo
    let lfrom = map_obj.from.toLowerCase();
    let lto = map_obj.to.toLowerCase();
    let lsan = map_obj.san.toLowerCase();
    let lcolor = map_obj.color.toLowerCase();
    let captured = "";
    let castling = false;
    let enpass = false;
    let promo = false;
    let capture = false;
    let castle_rook_to_ix = 0;

    let from_square_ix = squareCode2Idx(lfrom);

    ppiece = xfen_prev[from_square_ix][1];

    if (map_obj.hasOwnProperty("captured")) {
      captured = map_obj.captured.toLowerCase();
    }

    if (lsan.includes("o-o") || lsan.includes("o-o-o")) {
      castling = true;
    }
    if (ppiece == "p" && (lto[1] == "8" || lto[1] == "1")) {
      promo = true;
    }
    if (lsan.includes("x")) {
      capture = true;
    }
    if (lpiece == "p" && captured == "p" && (lto[1] == "6" || lto[1] == "3")) {
      // might be an enpassent case
      // and if the square we wound up on was empty previously
      if (xfen_prev[squareCode2Idx(lto)] == ".") {
        enpass = true;
        map_obj.enpass = true;
        // need to determine which pawn was captured, or just know that it is now gone
        // since it will be removed from the board 3D array by the updates
      }
    }


    // ==============================================================================
    // #####     build the current xfen using the prior xfen,
    // #####     the current efen, and relevant san/move info
    // =============================================================================
    // let from_square_ix = 0;
    let to_ix = squareCode2Idx(lto);
    for (ix = 0; ix < 64; ix++) {
      lpiece = efen[ix]; //xfen_curr[ix];
      if (lpiece != ".") {
        // the moved piece identified in the lto/map_obj.to
        // which means all other pieces are just copied from .prev to .curr
        // thus for all squares not identified by lto just copy the prior piece
        // except for the 3 special cases: castele, enpass, promo?
        if (to_ix != ix) {
          if (castling) {
            continue;
          }
          xfen_curr[ix] = JSON.parse(JSON.stringify(xfen_prev[ix]));
        } else {
          // and for the one square identified by lto then copy the piece
          // identified in the lfrom
          // from_square_ix = squareCode2Idx( lfrom );
          xfen_curr[ix] = JSON.parse(JSON.stringify(xfen_prev[from_square_ix]));
          if (promo == true) {
            //handle numbering the newly promoted piece
            promoted = lsan.split("=")[1][0];
            promoted = promoted.concat(
              numberNewPiece(xfen_prev[from_square_ix][2])
            );
            promoted = lcolor.concat(promoted);
            xfen_curr[ix] = JSON.parse(JSON.stringify(promoted));
          }
          if (castling == true) {
            // just 4 possible move combos for castling so this can be hard-coded
            // wk1 to g1 , wr2 to f1
            // wk1 to c1 , wr1 to d1
            // bk1 to g8 , br2 to f8
            // bk2 to c8 , br1 to d8
            // if (lsan.includes('o-o')) {
            //   debugger
            // }
            if (lto == "g1") {
              castle_rook_to_ix = squareCode2Idx("f1");
              xfen_curr[castle_rook_to_ix] = "wr2";
            }
            if (lto == "c1") {
              // O-O-O White
              castle_rook_to_ix = squareCode2Idx("d1");
              xfen_curr[castle_rook_to_ix] = "wr1";
            }
            if (lto == "g8") {
              castle_rook_to_ix = squareCode2Idx("f8");
              xfen_curr[castle_rook_to_ix] = "br2";
            }
            if (lto == "c8") {
              // O-O-O Black
              castle_rook_to_ix = squareCode2Idx("d8");
              xfen_curr[castle_rook_to_ix] = "br1";
            }
          }
        }
      }
    }

    // push the new xfen onto the end of the array
    this.xfens.push(xfen_curr);

    // prepare for next iteration through the half-move list (ply)
    local_ix++;
    xfen_prev = JSON.parse(JSON.stringify(xfen_curr));
    return map_obj;
  });

  // Sync indices, so idx 1 = first move
  this.fens.unshift("");
  this.history.unshift("");
  
  // Make an array storing all the captured/promoted pieces
  for (let i = 1; i < this.history.length; i++) {
    let output = "";
    let toSquare = this.history[i]["to"];
    let fromSquare = this.history[i]["from"];
    let toIndex = squareCode2Idx(toSquare);
    let fromIndex = squareCode2Idx(fromSquare);
    let capturedXPiece = "";
    let promotedXPiece = "";

    if ("captured" in this.history[i] && "promotion" in this.history[i]) {
      promotedXPiece = this.xfens[i - 1][fromIndex];
      capturedXPiece = this.xfens[i - 1][toIndex];
      output = promotedXPiece + ", " + capturedXPiece;
      if (DEBUG_FLAG) {
        console.log(
          promotedXPiece +
            " captured " +
            capturedXPiece +
            " and was promoted at move " +
            i
        );
      }
    } else if ("promotion" in this.history[i]) {
      promotedXPiece = this.xfens[i - 1][fromIndex];
      output = promotedXPiece;
      if (DEBUG_FLAG) {
        console.log(promotedXPiece + " was promoted at move " + i);
      }
    } else if ("enpass" in this.history[i]) {
      enpassToIndex = squareCode2Idx(this.history[i - 1]["to"])   // Get 'to' square-index of the previous pawn piece that will be en passant'ed 
      capturedXPiece = this.xfens[i - 1][enpassToIndex]
      output = capturedXPiece;
      if (DEBUG_FLAG) {
        console.log(capturedXPiece + " was captured via en passant at move " + i)
      }
    } else if ("captured" in this.history[i]) {
      capturedXPiece = this.xfens[i - 1][toIndex];
      output = capturedXPiece;
      if (DEBUG_FLAG) {
        console.log(capturedXPiece + " was captured at move " + i);
      }
    } else {
      output = "";
    }
    this.removed.push(output);
  }
}

// ========== Button Functions ============ //

// Clear all tables
function clearTables() {
  let tbody = document.getElementById("bdy100");
  tbody.innerHTML = "";
  let tr = document.getElementById("tr100");
  tr.innerHTML = "";
  let debugBody = document.getElementById("debug-body");
  debugBody.innerHTML = "";

  const pgnTextArea = document.getElementById("pgnTextArea");
  const jsonTextArea = document.getElementById("JSONTextArea");
  pgnTextArea.value = "";
  jsonTextArea.value = "";

  const importList = document.getElementById("import-pgn-list");
  importList.innerHTML = "";

  globalChessGame = null;
}

function importChessGame() {
  // Create an input element of type 'file'
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none"; // Hide the input element

  // Set the accept attribute to allow only PGN files
  fileInput.accept = ".pgn, .txt, .json";

  // Add an event listener to handle the selected file
  fileInput.addEventListener("change", function (event) {
    var file = event.target.files[0]; // Get the selected file

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var pgnText = e.target.result;
        // Do something with the imported PGN text (e.g., display it in the textarea)
        console.log(pgnText);
        document.getElementById("pgnTextArea").value = pgnText;
        document.getElementById("JSONTextArea").value = "";
        submitChessGame();
      };

      reader.readAsText(file); // Read the selected file as text
    }
  });

  // Trigger a click on the file input element
  fileInput.click();

}




function bindImportClickEvents() {
  const importListItems = document.querySelectorAll("#import-pgn-list li");
  //const copyAlert = document.getElementById("copyAlert"); // Select the unique copy alert element
  const pgnTextArea = document.getElementById("pgnTextArea");
  const jsonTextArea = document.getElementById("JSONTextArea");
  const tooltip = document.createElement("span");
  tooltip.classList.add("custom-tooltip");
  document.body.appendChild(tooltip); // Append the tooltip element to the body

  importListItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Clear textareas
      jsonTextArea.value = "";

      // Deselect all other items
      importListItems.forEach((otherItem) =>
        otherItem.classList.remove("selected")
      );

      // Select the clicked item
      item.classList.add("selected");

      // Copy the content to clipboard
      let pgn = formatPGN(item.textContent);
      tooltip.textContent = pgn;

      // Press 'submit' then 'export' button
      processChessGame(pgn);
      jsonTextArea.value = exportChessGame();
    });
  });
}

function submitChessGame() {
  const importList = document.getElementById("import-pgn-list");
  importList.innerHTML = "";
  let inputPGN = document.getElementById("pgnTextArea").value;
  let inputPGNArray = processMultiPGN(inputPGN);

  const max_pgn = 100
  if(inputPGNArray.length > max_pgn) {
    alert(`Your submission exceeds the maximum of ${max_pgn} PGNs.\nOnly the first 100 PGNs have been imported.`)
    inputPGNArray = inputPGNArray.slice(0, max_pgn);
  }
  console.log(`PGNS loaded: ${inputPGNArray.length}`)
  
  let ul_import = document.getElementById("import-pgn-list");
  inputPGNArray.forEach((item, i) => {
    let li_import = document.createElement("li");
    if (validatePGN(item) == null) {
      alert(`PGN #${i+1} is invalid.`)
      li_import.textContent = `${i + 1}: INVALID PGN`;
    } else {
      li_import.textContent = `${i + 1}: ${item}`;
    }
    ul_import.appendChild(li_import);
  });

  bindImportClickEvents();
}


// Process information into debug tables
function processChessGame(pgn) {

  if (validatePGN(pgn) == null) {
    alert("Invalid PGN.")
    return null;
  };

  let currentChessGame = new ChessGame(pgn);
  globalChessGame = currentChessGame;

  // Clear XFEN and Debug table header/row to prevent duplication
  let tbody = document.getElementById("bdy100");
  tbody.innerHTML = "";
  let tr = document.getElementById("tr100");
  tr.innerHTML = "";
  let debugBody = document.getElementById("debug-body");
  debugBody.innerHTML = "";

  // Code Tester

  let tbl = document.getElementById("bdy100");
  let trHeader = document.getElementById("tr100");
  let row = "";
  let cell = "";
  let conts = "";

  // xfen table header
  cell = trHeader.insertCell();
  cell.innerHTML = " ";

  for (i = 0; i <= 64; i++) {
    cell = trHeader.insertCell();
    conts = i.toString();
    if (conts.length < 2) {
      conts = "0" + conts;
    }
    conts = conts + "<br>" + squareXlat[i];
    if (i == 64) {
      cell.setAttribute("id", "xx-cell");
      conts = "xx"; // Add 'xx' column to the header
    }
    cell.setAttribute("class", "header")
    cell.innerHTML = conts;
  }

  // xfen table body
  for (i = 0; i < currentChessGame.xfens.length; i++) {
    row = tbl.insertRow();
    cell = row.insertCell();
    cell.innerHTML = i.toString();
    for (cd = 0; cd <= 64; cd++) {   
      cell = row.insertCell();
      if (cd == 64) {
        // Add captured pieces into 'xx' colum
        cell.innerHTML = formatCells(currentChessGame.removed[i]);
        if (currentChessGame.removed[i].length == 8) {
          let pieces = currentChessGame.removed[i].split(", ");
          cell.innerHTML = formatCells(pieces[0]) + ", " + formatCells(pieces[1]);
        }
      } else {
        conts = currentChessGame.xfens[i][cd];
        cell.innerHTML = formatCells(conts);
      }


      if (i > 0 && cd == squareCode2Idx(currentChessGame.history[i]["to"])) { // highlights "to" cells
        cell.setAttribute("class", "move-to")
      }
      if ((i < currentChessGame.xfens.length - 1) && cd == squareCode2Idx(currentChessGame.history[i + 1]["from"])) { // highlights "from" cells
        cell.setAttribute("class", "move-from")
      }
    }
  }

  // Iterate through the arrays and populate each column
  for (let i = 1; i < currentChessGame.history.length; i++) {
    // Create a new row
    const newRow = debugBody.insertRow();

    const turnCell = newRow.insertCell();
    turnCell.textContent = i;

    const pgnCell = newRow.insertCell();
    pgnCell.textContent = currentChessGame.history[i]["san"]; // Access each move's history object, access "to" key, get PGN of the turn

    const fromCell = newRow.insertCell();
    fromCell.textContent = currentChessGame.history[i]["from"];

    const toCell = newRow.insertCell();
    toCell.textContent = currentChessGame.history[i]["to"];

    const pieceCell = newRow.insertCell();
    pieceCell.textContent = currentChessGame.history[i]["piece"];

    const colorCell = newRow.insertCell();
    colorCell.textContent = currentChessGame.history[i]["color"];

    const xPieceCell = newRow.insertCell();
    let xPiecePos = squareCode2Idx(toCell.textContent); //Use "to" cell square code, get index, use index to get xpiece in xfens
    xPieceCell.textContent = currentChessGame.xfens[i][xPiecePos];

    const fenCell = newRow.insertCell();
    fenCell.textContent = currentChessGame.fens[i];
    fenCell.setAttribute("id", "FEN");
  }
}

//  Export chess game into JSON
function exportChessGame() {
  if (globalChessGame == null) {
    alert("Please press submit before exporting.")
    return null;
  }
  let jsonOut = document.getElementById("JSONTextArea") // Will be used for exporting to Python Server
  jsonOut.value = JSON.stringify(globalChessGame)
  console.log("exporting: \n" + JSON.stringify(globalChessGame))
  return JSON.stringify(globalChessGame)
}

