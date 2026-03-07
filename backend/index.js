require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/webhook', require('./routes/whatsapp'));

app.listen(3000, () => console.log('Roots backend running on 3000'));