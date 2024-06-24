async function fetchData(type, year) {

    const url = '/' + type + '/' + year;    


    const response = await fetch(url)
    const data = await response.json()
    await processPlayersStats(data);
    
}
async function processGamesStats(games) {
    let table = document.getElementById('games');
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

        row.appendChild(dateCell);
        row.appendChild(visitorCell);
        row.appendChild(ptsCell);
        row.appendChild(homeCell);
        row.appendChild(pts2Cell);

        table.appendChild(row);
    }
}

async function processPlayersStats(players) {
    let table = document.getElementById('players');
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

fetchData("players", "2024");
