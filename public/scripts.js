async function getInitialData() {
    
    const url1 = "players/2024";
    const url2 = "games/2024"
    
    const response1 = await fetch(url1)
    const data1 = await response1.json()

    const response2 = await fetch(url2)
    const data2 = await response2.json()

    processPlayersStats(data1);
    processGamesStats(data2);
}
async function processGamesStats(games) {
    let table = document.getElementById('games');
    let table2 = document.getElementById('players');


    for (let i = 0; i < games.length; i++) {
        let row = document.createElement('tr');

        let dateCell = document.createElement('td');
        dateCell.innerText = games[i].DATE;

        let visitorCell = document.createElement('td');
        visitorCell.innerText = games[i].VISITOR;

        let ptsCell = document.createElement('td');
        ptsCell.innerText = games[i].VPTS;

        let homeCell = document.createElement('td');
        homeCell.innerText = games[i].HOME;

        let pts2Cell = document.createElement('td');
        pts2Cell.innerText = games[i].HPTS;

        let boxscore = document.createElement('td');
        let link = document.createElement('a');
        link.href = "https://www.basketball-reference.com" + games[i].BOXSCORE;
        link.innerText = "BOXSCORE";
        boxscore.appendChild(link);

        let ot = document.createElement('td');
        ot.innerText = games[i].OT;

        let attendance = document.createElement('td');
        attendance.innerText = games[i].ATT;

        let log = document.createElement('td');
        log.innerText = games[i].LOG;

        let arena = document.createElement('td');
        arena.innerText = games[i].ARENA;

        row.appendChild(dateCell);
        row.appendChild(visitorCell);
        row.appendChild(ptsCell);
        row.appendChild(homeCell);
        row.appendChild(pts2Cell);
        row.appendChild(boxscore);
        row.appendChild(ot);
        row.appendChild(attendance);
        row.appendChild(arena);

        table.appendChild(row);
    }
}

async function processPlayersStats(players) {
    let table = document.getElementById('players');
    let table2 = document.getElementById('games');


    for (let i = 0; i < players.length; i++) {
        let row = document.createElement('tr');

        let playerCell = document.createElement('td');
        playerCell.innerText = players[i].PLAYER;

        let posCell = document.createElement('td');
        posCell.innerText = players[i].POS;

        let ageCell = document.createElement('td');
        ageCell.innerText = players[i].AGE;

        let tmCell = document.createElement('td');
        tmCell.innerText = players[i].TM;

        let ptsCell = document.createElement('td');
        ptsCell.innerText = players[i].PTS;

        let rebCell = document.createElement('td');
        rebCell.innerText = players[i].TRB;

        let astCell = document.createElement('td');
        astCell.innerText = players[i].AST;

        let stlCell = document.createElement('td');
        stlCell.innerText = players[i].STL;

        let blkCell = document.createElement('td');
        blkCell.innerText = players[i].BLK;

        let FieldPCell = document.createElement('td');
        if (players[i]['FG%'] != null) {
            FieldPCell.innerText = players[i]['FG%'];
        }
        else {
            FieldPCell.innerText = "0.0";
        }
        

        let ThreePCell = document.createElement('td');
        if (players[i]['3P%'] != null) {
            ThreePCell.innerText = players[i]['3P%'];
        }
        else {
            ThreePCell.innerText = "0.0";
        }
        
        let FTCell = document.createElement('td');
        if (players[i]['FT%'] != null) {
            FTCell.innerText = players[i]['FT%'];
        }
        else {
            FTCell.innerText = "0.0";
        }
        
        let TOVCell = document.createElement('td');
        if (players[i].TOV != null) {
            TOVCell.innerText = players[i].TOV;
        }
        else {
            TOVCell.innerText = "0.0";
        }

        

        row.appendChild(playerCell);
        row.appendChild(posCell);
        row.appendChild(ageCell);
        row.appendChild(tmCell);
        row.appendChild(ptsCell);
        row.appendChild(rebCell);
        row.appendChild(astCell);
        row.appendChild(stlCell);
        row.appendChild(blkCell);
        row.appendChild(FieldPCell);
        row.appendChild(ThreePCell);
        row.appendChild(FTCell);
        row.appendChild(TOVCell);


        table.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    getInitialData();
    
    var table2 = document.getElementById('games');
    table2.style.display = "none";

    var animation1 = document.querySelectorAll('.fade-in-table')
    animation1[0].style.display = 'block'; // Show the element
    setTimeout(function() {
        animation1[0].classList.add('show'); // Add class to trigger opacity transition
    }, 750); // Delay to ensure display change is applied first

    var games = document.getElementById('option2'); 
    var players = document.getElementById('option1');

    // Event listener for when 'game' is clicked
    games.addEventListener('click', function () {
        var table1 = document.getElementById('players');
        
        table1.style.display = "none"; // Hide table1 (players table)
        animation1[0].classList.remove('show');

        animation1[1].style.display = 'block'; // Show the element
        setTimeout(function() {
            animation1[1].classList.add('show'); // Add class to trigger opacity transition
        }, 750); // Delay to ensure display change is applied first
    });

    players.addEventListener('click', function () {
        var table1 = document.getElementById('players');
        
        table1.style.display = "none"; // Hide table1 (players table)
        animation1[1].classList.remove('show');

        animation1[0].style.display = 'block'; // Show the element
        setTimeout(function() {
            animation1[0].classList.add('show'); // Add class to trigger opacity transition
        }, 750); // Delay to ensure display change is applied first
    });

});





