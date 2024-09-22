const mongoose = require('mongoose')
const initData = require('./data')
const admin = require('../models/admin')

main().then((res)=>{console.log("connected to Db")})
.catch(err =>{console.log(err)})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Go');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}       

const initDb = async () => {
    await admin.deleteMany({})
    await admin.insertMany(initData.data )
    console.log(" initialize Db ");
};
initDb();

