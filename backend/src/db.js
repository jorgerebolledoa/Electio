import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: 'electio_db',
  user: 'electio_user',
  password: 'electio_pass',
  database: 'electio',
  port: 5432
});
