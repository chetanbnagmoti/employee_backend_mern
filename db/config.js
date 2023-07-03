const mongoose=require('mongoose');
const dbConnection = process.env.DB_CONNECTION;
//mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
mongoose.connect(dbConnection);