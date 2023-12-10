const {
	  createPool
} = require('mysql2/promise');

const cors = require('cors')
const express = require('express')
const app = express()
app.use(express.json())
app.use(cors())

const pool = createPool({
	host : "localhost",
	database : "dark",
	user : "root",
	password : "tiger",
	connectionLimit: 10
})

/* CRUD | HTTP Verb
Create: POST
Read: GET
Update: PUT
Delete: DELETE */

// fetch("https://example.com/profile", {
//       method: "POST", // or 'PUT'
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//                                                 GET USER

app.get('/getUser/:userID', async (req, res) => {

	const userID = req.params.userID; // Replace with the desired user_id

	if (userID > 10011 || userID < 10000) {
		res.json({ status: 'error' });
		return;
	}
  
	const result1 = await pool.execute(
	  'SELECT * FROM user_ WHERE user_id = ?',
	  [userID]
	);
  
	res.json({ user: result1[0][0], status: 'success' });
  });
  // Close the connection pool when the Node.js process is terminated
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

//                                                    DELETE USER
app.delete('/deleteUser/:userID', async (req, res) => {
	
	const userID = req.params.userID; // Replace with the desired user_id

	if (userID > 10011 || userID < 10000) {
		res.json({ status: 'error' });
		return;
	}
  
	const result1 = await pool.execute(
	  'DELETE FROM user_ WHERE user_id = ?',
	  [userID]
	);
  
	res.json({ user: result1[0][0], status: 'success' });
  });

  app.post('/adminUpdateUser/:userID', async (req, res) => {
	
	const userID = req.params.userID; // Replace with the desired user_id
  });


  //                                             NEW USER - FROM ADMIN SIDE
  app.post('/adminNewUser', async (req, res) => {
    const { userID, username, password, userType } = req.body;

    try {
        const result = await pool.execute(
            'INSERT INTO user_ (user_id, username, upassword, usertype) VALUES (?, ?, ?, ?)',
            [userID, username, password, userType]
        );

        res.json({ user: result[0], status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

 //                                             NEW USER - FROM USER SIDE
 app.post('/NewUser', async (req, res) => {
    const { userID, username, password, userType } = req.body;

    try {
        const result = await pool.execute(
            'INSERT INTO user_ (user_id, username, upassword, usertype) VALUES (?, ?, ?, ?)',
            [userID, username, password, userType]
        );

        res.json({ user: result[0], status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

  
  // Close the connection pool when the Node.js process is terminated
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

// 										   UPDATE USER - FROM ADMIN SIDE	

app.put('/adminUpdateUser/:userID', async (req, res) => {
    const userID = req.params.userID;
    const { username, password, userType } = req.body;

    if (userID > 10011 || userID < 10000) {
        res.json({ status: 'error' });
        return;
    }

    try {
        const result = await pool.execute(
            'UPDATE user_ SET username = ?, upassword = ?, usertype = ? WHERE user_id = ?',
            [username, password, userType, userID]
        );

        // Add the 'x-content-type-options' header
        res.header('x-content-type-options', 'nosniff');

        res.json({ user: result[0][0], status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// 										   UPDATE USER - FROM USER SIDE	

// Example function to get userID based on entered username
async function getUserIDByUsername(username) {
    try {
        const [result] = await pool.execute(
            'SELECT user_id FROM user_ WHERE username = ?',
            [username]
        );

        if (result.length > 0) {
            // Return the found userID
            return result[0].user_id;
        } else {
            // If no user found with the given username
            return null;
        }
    } catch (error) {
        console.error('Error getting userID by username:', error);
        throw error; // You may want to handle the error based on your application's needs
    }
}

app.put('/UpdateUser', async (req, res) => {
    const userIdentifier = req.body.userIdentifier;
    const { username, newUsername, password } = req.body;

    try {
        // Validate the userIdentifier and other necessary checks

        // Use the new function to get userID based on the entered username
        const userID = await getUserIDByUsername(username);

        if (!userID) {
            res.status(404).json({ status: 'error', message: 'User not found' });
            return;
        }

        const result = await pool.execute(
            'UPDATE user_ SET username = ?, upassword = ? WHERE user_id = ?',
            [newUsername, password, userID]
        );

        res.json({ user: result[0][0], status: 'success' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


//                                                GET GAME
app.get('/getGames/:gameID', async (req, res) => {

	const gameID = req.params.gameID; // Replace with the desired game_id

	if (gameID > 20008 || gameID < 20000) {
		res.json({ status: 'error' });
		return;
	}
  
	const result1 = await pool.execute(
	  'SELECT * FROM game WHERE game_id = ?',
	  [gameID]
	);
  
	res.json({ game: result1[0][0], status: 'success' });
  });
  


//                                                DELETE GAME

app.delete('/deleteGame/:gameID', async (req, res) => {
	
	const gameID = req.params.gameID; // Replace with the desired user_id

	if (gameID > 20008 || gameID < 20000) {
		res.json({ status: 'error' });
		return;
	}
  
	const result1 = await pool.execute(
	  'DELETE FROM game WHERE game_id = ?',
	  [gameID]
	);
  
	res.json({ game: result1[0][0], status: 'success' });
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


  //                                             NEW GAME - FROM ADMIN SIDE
  app.post('/adminNewGame', async (req, res) => {
    const { gameID, gameName, price, quantity } = req.body;

    try {
        const result = await pool.execute(
            'INSERT INTO game (game_id, game_name, price, quantity) VALUES (?, ?, ?, ?)',
            [gameID, gameName, price, quantity]
        );

        res.json({ game: result[0], status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


//                                             UPDATE GAME - FROM ADMIN SIDE
app.put('/adminUpdateGame/:gameID', async (req, res) => {
    const gameID = req.params.gameID;
    const { gameName, price, quantity } = req.body;

	if (gameID > 20008 || gameID < 20000) {
		res.json({ status: 'error' });
		return;
	}

    try {
        const result = await pool.execute(
            'UPDATE game SET game_name = ?, price = ?, quantity = ? WHERE game_id = ?',
            [gameName, price, quantity, gameID]
        );

        res.json({ game: result[0][0], status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


//                                                    LOGIN
app.post('/getLogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.execute(
            'SELECT * FROM user_ WHERE username = ? AND upassword = ?',
            [username, password]
        );

        if (result[0].length > 0) {
            const user = result[0][0];
            res.json({ user, status: 'success' });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

//                                                    STATS

app.get('/getStats', async (req, res) => {
    try {
        const maxPriceResult = await pool.execute(
            'SELECT game_name, price FROM game WHERE price = (SELECT MAX(price) FROM game)'
        );

        const minPriceResult = await pool.execute(
            'SELECT game_name, price FROM game WHERE price = (SELECT MIN(price) FROM game)'
        );

        const avgPriceResult = await pool.execute(
            'SELECT AVG(price) AS avg_price FROM game'
        );

        const maxPricedGame = maxPriceResult[0][0];
        const minPricedGame = minPriceResult[0][0];
        const avgPrice = avgPriceResult[0][0].avg_price;

        res.json({
            stats: {
                maxPricedGame,
                minPricedGame,
                avgPrice
            },
            status: 'success'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


//                                                   UPDATE ADMIN DETAILS   

app.put('/updateAdmin/:adminID', async (req, res) => {
    const adminID = parseInt(req.params.adminID);
    const { phone } = req.body;

    if (adminID !== 10000 && adminID !== 10001) {
		res.json({ status: 'error' });
        console.log("admin");
		return;
	}

    try {
        const result = await pool.execute(
            'UPDATE admin_ SET phone = ? WHERE admin_id = ?',
            [phone, adminID]
        );

        res.json({ admin: result[0][0], status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

  // Close the connection pool when the Node.js process is terminated
  process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

