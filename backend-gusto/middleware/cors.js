const cors = require('cors');


module.exports = cors({
        origin: "http://localhost:4200",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization","x-csrf-token"],
    })