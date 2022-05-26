const express = require("express");
var requests = require("requests");
const fetch = "node-fetch";
const xlsx = require("xlsx");
const api = require("./Api/Api");
const cors = require("cors");

const app = express();
const multer = require("multer");
const router = express.Router();
const bodyparser = require("body-parser");
const cron = require("node-cron");
const User = require("./modal/userschema");
const user1 = require("./userRouter/userRouter");
require("dotenv").config();
const files = require("./ExcelFile/Excelfile");
const connectdb = require("./DB File/Db");
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

app.use("/", router);
app.use("/auth", user1);
const file = require("./file/fileroute");
const { request } = require("express");
//to read data from excel file
var dataPathExcel = "Data.xlsx";
var wb = xlsx.readFile(dataPathExcel);
var sheetName = wb.SheetNames[0];
var sheetValue = wb.Sheets[sheetName];
// console.log(sheetValue);
var excelData = xlsx.utils.sheet_to_json(sheetValue);
console.log(excelData);
//for upload files
const filestorageEngine = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./Data");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: filestorageEngine });
app.post("/single", upload.single("Data"), (req, res) => {
  res.send("Single file uploaded success");
});

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });

// app.get('/DNC', async (req, res) => {
//   try{
//   const fetch_response= await fetch("https://api.ftc.gov/v0/dnc-complaints?api_key=c2xFSPWcPzehBXwqln2AUCqbvaNiF9uFYiOaMdF4");
//   const json = await fetch_response.json();
//   response.json(json)} catch(err){
//     console.log(err)
//   }
// }

// )
// const option ={
//   method:'get'
// }


app.get("/fetchapi", (req, res) => {
  requests(
    "https://api.ftc.gov/v0/dnc-complaints?api_key=c2xFSPWcPzehBXwqln2AUCqbvaNiF9uFYiOaMdF4"
  )
    .on("data", function (chunk) {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const pagination = chunk.slice(startIndex, endIndex);
      console.log(chunk);
      res.send(chunk);
      // res.send(pagination);
      console.log(pagination);
    })
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);

    
    });
});

//For db coonection
app.listen(4000, () => {
  console.log(`Example  listening at http://localhost`);
});
