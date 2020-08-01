import pool from "pg";

const databasePool = new pool.Pool({
    user: "bodroghy",
    password: "Nightwish23",
    database: "proman",
    host: "localhost"
})

export default databasePool;