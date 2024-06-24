const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');

const port = 3002;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abhi12345",
});

app.use(express.static(path.join(__dirname, 'public')));


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

app.get('/players/:year', async (req, res) => { 
    let sql = 'SELECT * FROM season' + req.params.year + ';';
    
    await con.query('USE player_stats', (err, result) => { 
        if (err) {
            console.error('Error executing query:', err);
        }
        else {
            console.log("Using player_stats database");
            con.query(sql, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ error: 'Failed to fetch data' });
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result, null, 2)); 
            });
        }

    });
});

app.get('/games/:year', async (req, res) => { 
    let sql = 'SELECT * FROM season' + req.params.year + ';';
    
    await con.query('USE game_stats', (err, result) => { 
        if (err) {
            console.error('Error executing query:', err);
        }
        else {
            console.log("Using game_stats database");
            con.query(sql, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ error: 'Failed to fetch data' });
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result, null, 2)); 
            });
        }

    });
});