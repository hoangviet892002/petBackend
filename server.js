const express = require('express');
const db = require('./database');
const cors = require('cors');


const route = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);


const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});