import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) =>
    res.send(`node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    // note template literal delimited with backticks
    console.log(`your server is running on port ${PORT}`)
);
