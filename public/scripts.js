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

        if(type == "players"){
            processPlayersStats(data, year)
        }
        else if(type == "games"){
            processGamesStats(data, year)
        }
        else if (type.startsWith("player/")){
            processPlayersStats(data, year)
        }

    }
    catch (error) {
        console.error('Error:', error.message);
    }
}


async function processGamesStats(games, year) {
    let table = document.getElementById('stats');


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
    
    let table = document.getElementById('stats');
    
    const stats =['Player', 'Pos', 'Age', 'Team', 'PTS', 'TRB', 'AST', 'STL', 'BLK', 'FG%', '3P%', 'FT%', 'TOV'];

    table.innerHTML = '';
    
    // Create the header row
    let headerRow = document.createElement('tr');
    
    // Loop through the headers and create <th> elements
    stats.forEach((stat) => {
        let th = document.createElement('th');
        th.innerText = stat;
        headerRow.appendChild(th);
    });
    
    // Append the header row to the table
    table.appendChild(headerRow);
    

    for (let i = 0; i < players.length; i++) {

        let row = document.createElement('tr');


        row.onclick = function() {
            advStats(players[i])
        };

        stats.forEach((stat) => {
            
            let cell = document.createElement('td');

            cell.innerText = players[i][stat]

            if(players[i][stat] == null){
                cell.innerText = ""
            }

            row.appendChild(cell)
        });


        table.appendChild(row);
    }
}

async function advStats(player) {
    
    let table = document.getElementById('stats');
    
    const stats =['Player', 'Pos', 'Age', 'Team', 'PTS', 'TRB', 'AST', 'STL', 'BLK', 'FG%', '3P%', 'FT%', 'TOV'];
    const advStats = ['G', 'GS', 'MP', 'FG', 'FGA', '3P', '3PA', '2P', '2P%', 'eFG%', 'FT', 'FTA', 'ORB', 'DRB', 'PF', 'Awards'];

    
    
    table.innerHTML = '';
    
    // Create the header row
    let headerRow = document.createElement('tr');
    let headerRow2 = document.createElement('tr');

    let row = document.createElement('tr');

    // Loop through the headers and create <th> elements
    stats.forEach((stat) => {
        let th = document.createElement('th');
        th.innerText = stat;
        headerRow.appendChild(th);

        let cell = document.createElement('td');
        cell.innerText = player[stat]
        if(player[stat] == null){
            cell.innerText = ""
        }
        row.appendChild(cell)
    });
    table.appendChild(headerRow);
    table.appendChild(row);

    let row2 = document.createElement('tr');

    advStats.forEach((adv)=>{
        let th = document.createElement('th');
        th.innerText = adv;
        headerRow2.appendChild(th);

        let cell = document.createElement('td');
        cell.innerText = player[adv]
        if(player[adv] == null){
            cell.innerText = ""
        }
        row2.appendChild(cell)
    })
    
    // Append the header row to the table
    
    table.appendChild(headerRow2);
    table.appendChild(row2);
    
    
}



document.addEventListener('DOMContentLoaded', function () {
    const d = new Date();
    let year = d.getFullYear();
    
    getData("players", year);

    var textBox = document.getElementById('textBox');
    var title = document.getElementById('title')

    title.innerText = "Season: " + year + "-" + String((Number(year)-1))

    let games = document.getElementById('option2')
    let players = document.getElementById('option1')
    let player = document.getElementById('option3')

    // Event listener for when 'game' is clicked
    games.addEventListener('click', function () {
        textBox.value = ""
        title.innerText = "Season: " + year + "-" + String((Number(year)-1))
        textBox.placeholder = 'Enter Season (ex. 2024)'
        getData("games", year);
    });

    players.addEventListener('click', function () {
        textBox.value = ""
        title.innerText = "Season: " + year + "-" + String((Number(year)-1))
        textBox.placeholder = 'Enter Season (ex. 2024)'
        getData("players", year);
    });

    player.addEventListener('click', function () {
        textBox.value = ""
        title.innerText = "Season Stats: " + year + "-" + String((Number(year)-1))
        textBox.placeholder = 'Enter "Player, Season" (ex. LeBron, 2014)'
        getData("player/lebron", year);
    });

    

    textBox.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            console.log(textBox.value)
            let year = textBox.value
            // Check which checkbox is selected
            if (players.checked) {
                let year = textBox.value
                title.innerText = "Season: " + year + "-" + String((Number(year)-1))
                getData('players', year);
            } 
            else if (games.checked) {
                let year = textBox.value
                title.innerText = "Season: " + year + "-" + String((Number(year)-1))
                getData('games', year);
            }
            else if (player.checked){
                let data = textBox.value
                
                data = data.split(",")
                console.log(data)

                if(data[1] === undefined){
                    title.innerText = "Season Stats: " + String(d.getFullYear()) + "-" + String(Number(d.getFullYear()-1))
                    getData('player/' + data[0], d.getFullYear())
                }
                else{
                    date = data[1].replace(/\s+/g, "")   
                    title.innerText = "Season Stats: " + date + "-" + String((Number(date)-1))
                    getData('player/' + data[0], date)
                }
                
            }

        }
    });
});
