import express from "express";
import pool from "./database.js";

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;


app.get('/boards', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM board ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.log('An error occured: ' + error);
    }
});

app.post('/boards', async (req, res) => {
    try {
        const newTitle = req.body.boardTitle;
        const result = await pool.query(
            `INSERT INTO board(title)
            VALUES ($1)
            RETURNING id`
            , [newTitle]);
        res.json(result);
    } catch (error) {
        console.log('An error occured: ' + error);
    }
});

app.put('/boards', async (req, res) => {
    try {
        const newTitle = req.body.title;
        const boardId = req.body.boardId;
        await pool.query(
            `UPDATE board
            SET title = $1
            WHERE id = $2`
            , [newTitle, boardId]);
        res.json(boardId);
    } catch (error) {
        console.log('An error occured: ' + error);
    }
});

app.delete('/boards', async (req, res) => {
    try {
        const boardId = req.body.boardId;
        pool.query(
            `DELETE FROM board
            WHERE id = $1`
            , [boardId]);
        res.json(boardId);
    } catch (error) {
        console.log('An error occured: ' + error);
    }
});

app.put('/boards/visibility', async (req, res) => {
    try {
        const boardId = req.body.boardId;
        await pool.query(
            `UPDATE board
            SET is_active = NOT is_active
            WHERE id = $1`
            , [boardId]);
        res.json(boardId);
    } catch (error) {
        console.log('An error occured: ' + error);
    }
});

app.get('/columns', async (req, res) => {
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

app.post('/columns', async (req, res) => {
    try {
        const boardId = req.body.boardId;
        const title = req.body.title;
        let columnId;
        const existingColumnRecord = await getExistingColumnRecord(title);
        if (existingColumnRecord.rows.length !== 0) {
            columnId = existingColumnRecord.rows[0].id;
        } else {
            const result = await registerNewColumn(title)
            columnId = result.rows[0].id;
        }
        await pool.query(
            `INSERT INTO column_in_board
                (board_id, status_id, order_by_position)
            VALUES ($1, $2,
                (SELECT MAX(order_by_position) + 1
                FROM column_in_board
                WHERE board_id = $1)
                )
            `, [boardId, columnId]);
        res.json(boardId);
    } catch (error) {
        console.log('Error ' + error);
        res.json('error');
    }
});

app.put('/columns', async (req, res) => {
    try {
        let columnId;
        const boardId = req.body.boardId;
        const originalColumnId = req.body.columnId;
        const title = req.body.title;
        const existingColumnRecord = await getExistingColumnRecord(title);
        if (existingColumnRecord.rows.length !== 0) {
            columnId = existingColumnRecord.rows[0].id;
        } else {
            const result = await registerNewColumn(title)
            columnId = result.rows[0].id;
        }
        if (originalColumnId !== columnId) {
            await pool.query(
                `
                UPDATE column_in_board
                SET status_id = $1
                WHERE board_id = $2 AND status_id = $3
                `, [columnId, boardId, originalColumnId]);
            await pool.query(
                `
                UPDATE card
                SET status_id = $1
                WHERE board_id = $2 AND status_id = $3
                `, [columnId, boardId, originalColumnId]
            )
        }
        res.json(columnId);
    } catch (error) {
        console.log('Error ' + error);
        res.json('error');
    }
});


app.get('/cards', async (req, res) => {
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

function getExistingColumnRecord(title) {
    return pool.query(`
        SELECT id
        FROM status
        WHERE name = $1
        `,[title]);
}

function registerNewColumn(title) {
    return pool.query(
        `
        INSERT INTO status(name)
        VALUES ($1)
        RETURNING id
        `, [title]);
}


app.listen(port, () => console.log(`Server initialized on port ${port}`));
