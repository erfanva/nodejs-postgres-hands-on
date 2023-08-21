const format = require('pg-format');

async function migrate_agents() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS agents
        (
            id SERIAL,
            PRIMARY KEY(id),
            name varchar(30) NOT NULL
        );`
    const emptiness_check_query = `SELECT * FROM agents LIMIT 1`;
    const insert_query = `
        INSERT INTO agents(name)
        VALUES %L;`
    const agents = [['ali'], ['mina'], ['saman']]

    await db.query(create_query)
    if((await db.query(emptiness_check_query)).rowCount == 0) 
        await db.query(format(insert_query, agents))
}

module.exports = {
    migrate_all: () => {
        migrate_agents()
    }
}