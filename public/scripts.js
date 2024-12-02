const history = new Map();

const playerStats = ['Player', 'Pos', 'Age', 'Team', 'PTS', 'TRB', 'AST', 'STL', 'BLK', 'FG%', '3P%', 'FT%', 'TOV'];
const advStats = ['G', 'GS', 'MP', 'FG', 'FGA', '3P', '3PA', '2P', '2P%', 'eFG%', 'FT', 'FTA', 'ORB', 'DRB', 'PF', 'Awards'];
const gameStats = ['DATE', 'VISITOR', 'VPTS', 'HOME', 'HPTS','BOXSCORE', 'OT', 'ATT', 'LOG']


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


async function getData(type, year) {
    
    const url1 = type + '/' + year;
    console.log(url1);
    try {
        
        if(!(history.has(year) && (history.get(year))[0] === type)){
            console.log("query")
            const response = await fetch(url1);
            const data = await response.json();
            history.set(year, [type, data])
        }

        displayData(type, (history.get(year))[1], year)
        console.log(history)

    }
    catch (error) {
        console.error('Error:', error.message);
    }
}

async function displayData(type, data, year){
    
    let table = document.getElementById('stats');
    
    table.innerHTML = '';


    if(type == "players"){
        var stats = playerStats
        
    }   
    else if(type == "games"){
        var stats = gameStats
    }
    else if(type.startsWith("player")){
        displayAdv(data[0])
        return        
    }

    
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
    

    for (let i = 0; i < data.length; i++) {


        let row = document.createElement('tr');


        if(type=="players"){
            row.onclick = function() {
                
                advStats(players[i])
            };
        }


        stats.forEach((stat) => {

            let cell = document.createElement('td');




            if(data[i][stat] == null){
                cell.innerText = ""
            }
            else if(stat == "BOXSCORE"){
                let link = document.createElement('a');
                link.href = "https://www.basketball-reference.com" + data[i][stat];
                link.innerText = "BOXSCORE";
                cell.appendChild(link);
            }
            else{
                cell.innerText = data[i][stat]
            }

            row.appendChild(cell)
        });


        table.appendChild(row);
    }

}

async function displayAdv(player) {
    
    let table = document.getElementById('stats');
        
    table.innerHTML = '';
    
    let stats = playerStats
    let stats2 = advStats

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

    stats2.forEach((adv)=>{
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
