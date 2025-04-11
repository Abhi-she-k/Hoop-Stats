const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();


const app = express();
const port = 3004;


var gamePool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.GAME_DB,
    // ssl: {
    //     rejectUnauthorized: false
    // }
});

var playerPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.PLAYER_DB,
    // ssl: {
    //     rejectUnauthorized: false
    // }
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

