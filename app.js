const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running ");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBServer();

//Get All Players API
app.get("/players/", async (request, response) => {
  const getBooksQuery = `
        SELECT *
        FROM cricket_team;
    `;
  const bookQuery = await db.all(getBooksQuery);
  response.send(bookQuery);
});

//Add Player API
app.post("/players/", async (request, response) => {
    const playerDetails = request.body;
    const {
        playerName,
        jerseyNumber,
        role,
    } = playerDetails;
    const addPlayerDetails = `
        INSERT INTO cricket_team{playerName, jerseyNumber, role}
        VALUES 
        (
            `${playerName}`, 
            `${jerseyNumber}`,
            `${role}`
        );
    `;
    const dbResponse = await db.run(addPlayerDetails);
    const playerId = dbResponse.lastID;
    response.send("Player Added to Team");
})

//Get Player Details API
app.get("/players/:playerId/", async(request, response) => {
    const {playerId} = request.params;
    const getPlayerQuery = `
        SELECT *
        FROM cricket_team
        WHERE playerId = `${playerId}`;
    `;
    const player = db.get(getPlayerQuery);
    response.send(player);
})

//Update Player Details API
app.put("/players/:playerId/", async (request, response) => {
    const {playerId} = request.params;
    const playerDetails = request.body;
    const {
        playerName, jerseyNumber, role,
    } = playerDetails;
    const updatePlayerQuery = `
        Update cricket_team
        SET 
        playerName = `${playerName}`,
        jerseyNumber = `${jerseyNumber}`,
        role = `${role}`
        WHERE playerId = `${playerId}`;
    `;
    const updatedPlayerDetails = await db.run(updatePlayerQuery);
    response.send(updatedPlayerDetails);
})

//Delete Plater API
app.delete("/players/:playerId/", async (request, response) => {
    const {playerId} = request.params;
    const deleteQuery = `
    DELETE FROM cricket_team
    WHERE playerId = `${playerId}`;
    `;
    await db.run(deleteQuery);
    response.send("Player Removed");
})

module.exports = app;







