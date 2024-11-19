const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const port = 3002;




var gamePool = mysql.createPool({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "abhi12345",
    database: "game_stats"
});

var playerPool = mysql.createPool({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "abhi12345",
    database: "player_stats"
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
    const sql = `SELECT * FROM season${req.params.year} WHERE Player LIKE '${req.params.player}%';`;
    
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

