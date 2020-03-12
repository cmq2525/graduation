const express = require('express');
const app = express();
const router = require('./router.js')


app.use('/',router);
app.use(express.static('./dist'));

app.listen(7777, () => console.log('Example app listening on port 7777!'));

