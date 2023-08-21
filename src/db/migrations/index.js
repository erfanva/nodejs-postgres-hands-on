const format = require('pg-format');

async function drop_all() {
    const query = `DROP TABLE IF EXISTS costumers, agents, vendors, orders, delay_reports;`
    await db.query(query)
}

async function migrate_costumers() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS costumers
        (
            id SERIAL,
            PRIMARY KEY(id),
            name varchar(30) NOT NULL,
            created_at timestamp default current_timestamp
        );`
    const emptiness_check_query = `SELECT * FROM costumers LIMIT 1`;
    const insert_query = `
        INSERT INTO costumers(name)
        VALUES %L;`
    const agents = [['reza coustumer'], ['sara coustumer'], ['shayan coustumer']]

    await db.query(create_query)
    if((await db.query(emptiness_check_query)).rowCount == 0) 
        await db.query(format(insert_query, agents))
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
    const agents = [['ali agent'], ['mina agent'], ['saman agent']]

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
            costumer_id integer REFERENCES costumers (id) NOT NULL,
            vendor_id integer REFERENCES vendors (id) NOT NULL,
            delivery_time integer,
            created_at timestamp default current_timestamp
        );`
    await db.query(create_query)
}

async function migrate_delay_reports() {
    const create_query = `
        CREATE TABLE IF NOT EXISTS delay_reports
        (
            id SERIAL,
            PRIMARY KEY(id),
            order_id integer REFERENCES orders (id) NOT NULL,
            costumer_id integer REFERENCES costumers (id) NOT NULL,
            trip_status varchar(25),
            delay integer,
            created_at timestamp default current_timestamp
        );`
    await db.query(create_query)
}

module.exports = {
    drop_all: drop_all,
    migrate_all: async () => {
        await migrate_agents()
        await migrate_costumers()
        await migrate_vendors()
        await migrate_orders()
        await migrate_delay_reports()
    }
}