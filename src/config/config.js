require ("dotenv").config();

const config = {
    PORT: process.env.PORT || 3000,
    URI_DB: process.env.URI_DB 
}

module.exports = config;