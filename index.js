const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');


const app = express();
const port = 3004;




var gamePool = mysql.createPool({
    host: "hoopstatsdb.mysql.database.azure.com",
    user: "hoopstatsadmin",
    port: "3306",
    password: "strongaura1407#",
    database: "game_stats",
    ssl: {
        ca: fs.readFileSync("/Users/abhishekpaul/Downloads/DigiCertGlobalRootCA.crt.pem") // Load the certificate file
    }
});

var playerPool = mysql.createPool({
    host: "hoopstatsdb.mysql.database.azure.com",
    user: "hoopstatsadmin",
    port: 3306,  // port should be a number, not a string
    password: "strongaura1407#",
    database: "player_stats",
    ssl: {
        ca: fs.readFileSync("/Users/abhishekpaul/Downloads/DigiCertGlobalRootCA.crt.pem") // Load the certificate file
    }
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

// Endpoint for players
app.get('/players/:year', async (req, res) => {
    const sql = `SELECT * FROM season${req.params.year};`;
    
    try {
        const [rows] = await playerPool.query(sql);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint for player
app.get('/player/:player/:year', async (req, res) => {

    const sql = `SELECT * FROM season${req.params.year} WHERE Player LIKE '%${req.params.player}%';`;
    
    try {
        const [rows] = await playerPool.query(sql);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint for games
app.get('/games/:year', async (req, res) => {

    

    const sql = `SELECT * FROM season${req.params.year};`;
    
    try {
        const [rows] = await gamePool.query(sql);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

