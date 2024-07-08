async function getInitData(year) {
    

    const url1 = "players/" + year;
    const url2 = "games/" + year;

    try {
        const response = await fetch(url1);
        
        if (!response.ok) {
          if (response.status === 500) {
              alert('Failed to fetch data');
          } else {
            throw new Error(`HTTP error: ${response.status}`);
          }
        }
        
        const data = await response.json();
        processPlayersStats(data);
    }
    catch (error) {
        console.error('Error:', error.message);
      }

    
    try {
        const response = await fetch(url2);
        
        if (!response.ok) {
          if (response.status === 500) {
              alert('Failed to fetch data');
          } else {
            throw new Error(`HTTP error: ${response.status}`);
          }
        }
        
        const data = await response.json();
        processGamesStats(data);
    }
    catch (error) {
        console.error('Error:', error.message);
      }  
}

async function getData(type, year) {
    
    const url1 = type + '/' + year;
    console.log(url1);
    try {
        const response = await fetch(url1);
        
        if (!response.ok) {
          if (response.status === 500) {
              alert('Failed to fetch data');
          } else {
            throw new Error(`HTTP error: ${response.status}`);
          }
        }
        
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}


async function processGamesStats(games) {
    let table = document.getElementById('games');

    if (table.innerHTML != "") {
        table.innerHTML = `
            <tr id="tableHeader">
                <th>Date</th>
                <th>Visitor</th>
                <th>Pts</th>
                <th>Home</th>
                <th>Pts</th>
                <th>Boxscore</th>
                <th>OT</th>
                <th>Attendance</th>
                <th>Arena</th>
            </tr>`;
    }

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
    
    if (table.innerHTML != "") {
        table.innerHTML = `
            <tr id="tableHeader">
                <th>Player</th>
                <th>Position</th>
                <th>Age</th>
                <th>Team</th>
                <th>Points</th>
                <th>Rebounds</th>
                <th>Assists</th>
                <th>Steals</th>
                <th>Blocks</th>
                <th>FG%</th>
                <th>3PT%</th>
                <th>FT%</th>
                <th>TOV</th>
            </tr>`;
    }


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
    getInitData(2024);
    var table1 = document.getElementById('players');
    var table2 = document.getElementById('games');

    table2.style.display = "none";

    var animation1 = document.querySelectorAll('.fade-in-table')

    animation1[0].style.display = 'block'; // Show the element
    
    setTimeout(function () {
        animation1[0].classList.add('show'); // Add class to trigger opacity transition
    }, 2000); // Delay to ensure display change is applied first

    var players = document.getElementById('option1');
    var games = document.getElementById('option2'); 
    var player = document.getElementById('option3');
    var game = document.getElementById('option4'); 
    var random = document.getElementById('option5');
    var other = document.getElementById('option6'); 
    

    

    // Event listener for when 'game' is clicked
    games.addEventListener('click', function () {
        
        table1.style.display = "none"; // Hide table1 (players table)
        animation1[0].classList.remove('show');

        animation1[1].style.display = 'block'; // Show the element
        setTimeout(function() {
            animation1[1].classList.add('show'); // Add class to trigger opacity transition
        }, 750); // Delay to ensure display change is applied first
    });

    players.addEventListener('click', function () {
        
        table2.style.display = "none"; // Hide table2 (games table)
        animation1[1].classList.remove('show');


        animation1[0].style.display = 'block'; // Show the element
        setTimeout(function() {
            animation1[0].classList.add('show'); // Add class to trigger opacity transition
        }, 750); // Delay to ensure display change is applied first
    });

    var yearsubmit = document.getElementById('year-submit');

    yearsubmit.addEventListener('click', function () {
        var year = document.getElementById('year').value;
        document.getElementById("yearForm").reset();
        
 
        if (players.checked) {
            getData('players', year)
                .then(data => processPlayersStats(data));
        }
        else if (games.checked) {
            getData('games', year)
                .then(data => processGamesStats(data));
        }
        


        console.log(year);
    });
});





