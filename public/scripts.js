const history = new Map();

const playerStats = ['Player', 'Pos', 'Age', 'Team', 'PTS', 'TRB', 'AST', 'STL', 'BLK', 'FG%', '3P%', 'FT%', 'TOV'];
const advStats = ['G', 'GS', 'MP', 'FG', 'FGA', '3P', '3PA', '2P', '2P%', 'eFG%', 'FT', 'FTA', 'ORB', 'DRB', 'PF', 'Awards'];
const gameStats = ['DATE', 'VISITOR', 'VPTS', 'HOME', 'HPTS','BOXSCORE', 'OT', 'ATT', 'LOG']


const textBox = document.getElementById('textBox');
const textBox2 = document.getElementById('textBox2');
const filter = document.getElementById('filter');
const title = document.getElementById('title');
const title2 = document.getElementById('title2');
const stats2 = document.getElementById('stats2');

const players = document.getElementById('option1');
const games = document.getElementById('option2');
const player = document.getElementById('option3');
const compare = document.getElementById('option4');

const d = new Date();
const currentYear = d.getFullYear();

document.addEventListener('DOMContentLoaded', function () {
  

    cleanUP();
    getData("players", currentYear);
    updateTitleAndPlaceholder("Games Stats", currentYear, 'Enter Season (ex. 2024)');

    // Event listener for 'games' option
    games.addEventListener('click', function () {
        cleanUP();
        updateTitleAndPlaceholder("Games Stats", currentYear, 'Enter Season (ex. 2024)');
        getData("games", currentYear, 1);
    });

    // Event listener for 'players' option
    players.addEventListener('click', function () {
        cleanUP();
        updateTitleAndPlaceholder("Players Stats", currentYear, 'Enter Season (ex. 2024)');
        getData("players", currentYear, 1);
    });

    // Event listener for 'player' option
    player.addEventListener('click', function () {
        cleanUP();
        filter.style.display = "none";
        updateTitleAndPlaceholder("Player Stats", currentYear, 'Enter Player and Season (ex. Lebron, 2024)');
        getData("player/lebron", currentYear, 1);
    });

    // Event listener for 'compare' option
    compare.addEventListener('click', function () {
        cleanUP();
        filter.style.display = "none";
        textBox2.style.display = "";
        title2.style.display = "";
        stats2.style.display = "";

        updateTitleAndPlaceholder("Player Stats", currentYear, 'Enter Player and Season (ex. Lebron, 2024)');
        getData("player/lebron", currentYear, 1);
        title2.innerText = "Player Stats: 1996-1995";
        getData("player/michael jordan", 1996, 2);
    });

    // Event listener for textBox input
    textBox.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            content = textBox.value
            handleTextBoxInput(content);
        }
    });

    // Event listener for textBox2 input
    textBox2.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            content = textBox2.value
            handleTextBox2Input(content);
        }
    });

    // Event listener for filter input
    filter.addEventListener('keydown', function (event) {
        filterTableRows(filter.value.toLowerCase());

    });
});

function cleanUP() {

    // Check if elements exist before modifying them
    if (textBox) textBox.value = "";
    if (filter) filter.style.display = "";
    if (textBox2) textBox2.style.display = "none";
    if (title2) title2.style.display = "none";
    if (stats2) stats2.style.display = "none";
}

function updateTitleAndPlaceholder(text, year, placeholderText) {
    title.innerText = `${text}: ${year}-${Number(year) - 1}`;
    textBox.placeholder = placeholderText;
}

function handleTextBoxInput(content) {

    if (players.checked ) {

        var year = content

        if( year == null){
            year = currentYear
        }
        updateTitleAndPlaceholder("Players Stats", year, 'Enter Season (ex. 2024)');
        getData(`players`, year, 1);
        
    } 
    else if (games.checked) {

        var year = content

        if( year == null){
            year = currentYear

        }
        updateTitleAndPlaceholder("Games Stats", year, 'Enter Season (ex. 2024)');
        getData(`games`, year, 1);

    }
    else if(player.checked) {
        
        var [playerName, year] = content.split(',').map(item => item.trim());
        

        if(year == null){
            year = currentYear
        }
        updateTitleAndPlaceholder("Player Stats", year, 'Enter Season (ex. 2024)');
        getData(`player/${playerName}`, year, 1);

    }
    else if(compare.checked) {
        var [playerName, year] = content.split(',').map(item => item.trim());
        

        if(year == null){
            year = currentYear
        }
            
        updateTitleAndPlaceholder("Player Stats", year, 'Enter Season (ex. 2024)');
        getData(`player/${playerName}`, year, 1);
    
    }
}

function handleTextBox2Input(content) {
    
    var [playerName, year] = content.split(',').map(item => item.trim());


    if(year == null){
        year = currentYear
    }
    title2.innerText = `Player Stats: ${year}-${Number(year) - 1}`;
    getData(`player/${playerName}`, year, 2);
    
}

function filterTableRows(filterValue) {
    const rows = document.querySelectorAll("#stats tr");

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip the first row
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filterValue) ? "" : "none";
    });
}


async function getData(type, year, stat) {
    
    const url1 = type + '/' + year;
    console.log(url1);
    try {
        
        if(!(history.has(year) && (history.get(year))[0] === type)){
            console.log("query")
            const response = await fetch(url1);
            const data = await response.json();
            history.set(year, [type, data])
        }

        displayData(type, (history.get(year))[1], year, stat)
        console.log((history.get(year))[1])
        console.log(history)

    }
    catch (error) {
        console.error('Error:', error.message);
    }
}

async function displayData(type, data, year, stat){

    if(type == "players"){
        var stats = playerStats
        
    }   
    else if(type == "games"){
        var stats = gameStats
    }
    else if(type.startsWith("player")){
        displayAdv(data, stat)
        return        
    }

    let table = document.getElementById('stats');

    table.innerHTML = '';

    table.appendChild(createHeaderRow(stats));

    data.forEach(item => {
        const row = createDataRow(item, stats, type);
        table.appendChild(row);
    });

}

async function displayAdv(players, stat) {
    

    if(stat==1){
        var table = document.getElementById('stats');
    }
    else{
        var table = document.getElementById('stats2');

    }

    table.innerHTML = '';


    players.forEach(player => {
        let stats = playerStats
        let stats2 = advStats

        // Add an empty row for space
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 16;  
        emptyCell.style.height = "20px";  
        emptyCell.style.border = "1px solid"
    
    
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
        
        table.appendChild(headerRow);
        table.appendChild(row);
        table.appendChild(headerRow2); 
        table.appendChild(row2);


        emptyRow.appendChild(emptyCell);
        table.appendChild(emptyRow);

    });
}



function createHeaderRow(stats) {
    const headerRow = document.createElement('tr');
    stats.forEach(stat => {
        const th = document.createElement('th');
        th.innerText = stat;
        headerRow.appendChild(th);
    });
    return headerRow;
}

function createDataRow(item, stats, type) {
    const row = document.createElement('tr');
    stats.forEach(stat => {
        const cell = document.createElement('td');
        if (item[stat] == null) {
            cell.innerText = "";
        } else if (stat === "BOXSCORE") {
            const link = document.createElement('a');
            link.href = `https://www.basketball-reference.com${item[stat]}`;
            link.innerText = "BOXSCORE";
            cell.appendChild(link);
        } else {
            cell.innerText = item[stat];
        }
        row.appendChild(cell);
    });
    return row;
}