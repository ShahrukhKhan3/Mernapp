const  mongoose = require('mongoose');

const connectdb = ()=>{
const db= `mongodb+srv://Shahrukh-Khan2:libra171997@cluster0.zp15u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(db).then(()=>{
    console.log('connected');
}).catch((error)=> console.log("not connected"));

}
module.exports = connectdb;