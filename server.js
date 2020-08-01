import express from "express";
import pool from "./database.js";

const app = express();
app.use(express.static('public'));
const port = 3000;


app.get('/get-boards', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM board ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.log('An error occured: ' + error)
    }
});

app.get('/get-statuses', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                status.name AS name,
                status.id AS id,
                column_in_board.board_id AS board_id,
                board.is_active AS active
            FROM column_in_board
            LEFT JOIN status on column_in_board.status_id = status.id 
            LEFT JOIN board on column_in_board.board_id = board.id
            ORDER BY order_by_position
            `);
        res.json(result.rows);
    } catch (error) {
        console.log('An error occured: ' + error)
    }
});


app.get('/get-cards', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT card.id AS id, 
                card.board_id AS board_id, 
                card.title AS title,
                card.order_by_position AS position,
                status.id As status_id,
                status.name AS status
            FROM card
            LEFT JOIN status ON card.status_id = status.id
            ORDER BY card.order_by_position ASC
            `);
        res.json(result.rows);
    } catch (error) {
        console.log('An error occured: ' + error)
    }
});


app.listen(port, () => console.log(`Server initialized on port ${port}`));
