const format = require('pg-format');

async function drop_all() {
    const query = `DROP TABLE IF EXISTS agents, vendors, orders;`
    await db.query(query)
}

async function migrate_agents() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS agents
        (
            id SERIAL,
            PRIMARY KEY(id),
            name varchar(30) NOT NULL,
            created_at timestamp default current_timestamp
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
            name varchar(30) NOT NULL,
            created_at timestamp default current_timestamp
        );`
    const emptiness_check_query = `SELECT * FROM vendors LIMIT 1`;
    const insert_query = `
        INSERT INTO vendors(name)
        VALUES %L;`
    const vendors = [['halal food'], ['sib360'], ['mohsen']]

    await db.query(create_query)
    if((await db.query(emptiness_check_query)).rowCount == 0) 
        await db.query(format(insert_query, vendors))
}

async function migrate_orders() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS orders
        (
            id SERIAL,
            PRIMARY KEY(id),
            vendor_id integer REFERENCES vendors (id) NOT NULL,
            delivery_time integer,
            created_at timestamp default current_timestamp
        );`
    await db.query(create_query)
}

module.exports = {
    drop_all: drop_all,
    migrate_all: async () => {
        await migrate_agents()
        await migrate_vendors()
        await migrate_orders()
    }
}