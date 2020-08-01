import express from "express";
import pool from "./database.js"

const app = express();
app.use(express.static('public'));
const port = 3000;

// app.get('/', async (req, res) => {
//     try {
//         console.log('Get');
//         const allData = await pool.query('SELECT title FROM card');
//         res.send(allData.rows);
//     } catch (error) {
//         console.log('An error occured: ' + error)
//     }
// })

app.listen(port, () => console.log(`Server initialized on port ${port}`));
