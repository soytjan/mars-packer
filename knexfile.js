
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/mars_packer',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
 }