import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',           // replace with your user
  host: '194.164.148.58',          // or your VPS public IP
  database: 'postgres',       // replace with your DB name
  password: 'postgresPassword',  // replace with your DB password
  port: 5432,
});

export default pool;
