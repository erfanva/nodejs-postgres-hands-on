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

async function migrate_vendors() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS vendors
        (
            id SERIAL,
            PRIMARY KEY(id),
            name varchar(30) NOT NULL
        );`
    const emptiness_check_query = `SELECT * FROM vendors LIMIT 1`;
    const insert_query = `
        INSERT INTO vendors(name)
        VALUES %L;`
    const agents = [['halal food'], ['sib360'], ['mohsen']]

    await db.query(create_query)
    if((await db.query(emptiness_check_query)).rowCount == 0) 
        await db.query(format(insert_query, agents))
}

async function migrate_orders() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS orders
        (
            id SERIAL,
            PRIMARY KEY(id),
            vendor_id integer REFERENCES vendors (id),
            delivery_time integer
        );`
    await db.query(create_query)
}

module.exports = {
    migrate_all: () => {
        migrate_agents()
        migrate_vendors()
        migrate_orders()
    }
}