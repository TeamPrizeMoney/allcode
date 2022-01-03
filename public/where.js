const fs = require("fs");
const mongoose = require("mongoose");
const express = require('express');
const app = express();
const port = 3000;
let resultToBePrinted = null;


const data = require("./data.json");
  // res.send("hello ");
//const stringObj = JSON.parse(data);
mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: String,
    GT: String,
    F: String,
    GA: String,
    NS: String,
    HD: String,
    DP: String,
    DC: String,
    DC3: String,
    ALT: String,
    SPA: String,
    ST: String,
    REG: String,
    MTP: String,
    SIM: String
});
const vehicleUpdateData = new mongoose.model("VehicleUpdateData",vehicleUpdateSchema);


const dataToString = JSON.stringify(data);
const obj = JSON.parse(dataToString);



for(let i = 0; i < obj.length; i++)
{
    const newVehicleData = new vehicleUpdateData(
        {
            T: obj[i].T,
            GD: obj[i].GD,
            GT: obj[i].GT,
            F: obj[i].F,
            GA: obj[i].GA,
            NS: obj[i].NS,
            HD: obj[i].HD,
            DP: obj[i].DP,
            DC: obj[i].DC,
            DC3: obj[i].DC3,
            ALT: obj[i].ALT,
            SPA: obj[i].SPA,
            ST: obj[i].ST,
            REG: obj[i].REG,
            MTP: obj[i].MTP,
            SIM: obj[i].SIM
        }
    );
    
    newVehicleData.save();
    
}


vehicleUpdateData.find().then((result)=>{
    let latest = result.length;
    console.log(result[latest-1].T);
    // res.send(result[latest-1].T);
    resultToBePrinted = result;


}).catch((err)=>{
    console.log(err);

});




