const fs = require("fs");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const express = require('express');
const app = express();
var bodyParser = require("body-parser");
require('dotenv').config();
var request = require('request');

//http variable initialize
var http = require('http').Server(app);

//importing socket io
var io = require('socket.io')(http);
//port variable initialise
var port = process.env.PORT || 3000;


//Body parser things---------------------------
var jsonParser = bodyParser.json();
app.use(bodyParser());
var urlEncodedParser =  bodyParser.urlencoded({extended: false});

//Body parser things---------------------------





app.set('view engine', 'ejs');

let overspeedingLimit = 60;


app.use(express.static(__dirname + "/public"));


app.listen(port, (req, res) =>{
    console.log("the server is up and running");
});
//Auth code-----------------------
const { auth, requiresAuth } = require('express-openid-connect');

app.use(
    auth({
        authRequired:false,
        auth0Logout: true,
        issuerBaseURL:process.env.ISSUER_BASE_URL,
        baseURL:process.env.BASE_URL,
        clientID:process.env.CLIENT_ID,
        secret:process.env.SECRET,
    })
);

//AUth code----------xxxxx---------



// app.get("/", (req, res)=>{
//     // res.send(req.oidc.isAuthenticated()?'Logged in':'Logged out');
//     if(req.oidc.isAuthenticated())
//     {
//         res.send('Logged in');
//     }else
//     {
//         res.send('logged outddd');
//     }
// });

app.get('/profile', requiresAuth(), (req,res)=>{
    res.send(JSON.stringify(req.oidc.user));
});

app.get('/welcome', requiresAuth(), (req,res)=>{
    res.send(JSON.stringify(req.oidc.user));
});


app.get('/home', (req,res)=>{
    res.render("home");
});


app.get("/",requiresAuth(), (req, res)=>{
    //connecting to mongoose---------------
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );

    //connecting to mogoose ------xxxx------xxxx


        const registeredUserSchema = new mongoose.Schema({
            Name: String,
            Email: String,
            UniqueId:Number
            });

        const registeredUserData = new mongoose.model("newUserData",registeredUserSchema);
        
        var userDetails = JSON.stringify(req.oidc.user);
        var userDetailsObj = JSON.parse(userDetails);

            
        registeredUserData.find({Email:userDetailsObj.email}, function (err, docs) {

                // res.render("specificTimeDistance",{here:docs});
                // console.log("And I am iron man"+docs)
        
                if(docs==null)
                {
                    console.log("Record doesn't exist");
                    const newRegisteredUserData = new registeredUserData(
                        {
                            Name: userDetailsObj.name,
                            Email: userDetailsObj.email,
                            UniqueId: 123,
                        }
                    );
                    
                    newRegisteredUserData.save();
                }
                else
                {
                    console.log("Record exists");
                }
        });
    // var coordinates = [[18.541706, 73.884019],
    // [18.542322, 73.883930],
    // [18.542943, 73.883805],
    // [18.543403, 73.883679],
    // [18.543896, 73.883544]];

    //////////////////////////////////////////////////////////
    // res.render('homePage',{latLonFromNode:coordinates});
    res.render('homePage');



    //////////////////////////////////////////////////////////


});

app.get("/getData",function(req,res){
    // request({   
    //     uri:"localhost:3000/getData",
        
    //     qs:"Hello"
    // }).pipe(res);
    res.send(JSON.stringify([[18.541706, 73.884019],
        [18.542322, 73.883930],
        [18.542943, 73.883805],
        [18.543403, 73.883679],
        [18.543896, 73.883544]]));
    // res.push("Hello");
    // res.r "Hello";
});



app.get("/where", function(req, res){
    const data = require("./data.json");
    // res.send("hello ");
    //const stringObj = JSON.parse(data);
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



    const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: Number,
    GT: Number,
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
            GD: Number(obj[i].GD),
            GT: Number(obj[i].GT),
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
    let mixedLatLong = result[latest-1].GA;

    let latLon = result[latest-1].GA.split("|");


    res.render("where",{title:latLon[0]});


    }).catch((err)=>{
    console.log(err);

    });

});

app.get("/history", function(req, res){
    const data = require("./data.json");
    // res.send("hello ");
    //const stringObj = JSON.parse(data);
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



    const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: Number,
    GT: Number,
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
            GD: Number(obj[i].GD),
            GT: Number(obj[i].GT),
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
    let mixedLatLong = result[latest-1].GA;

    let latLon = result[latest-1].GA.split("|");


    res.render("history",{title:latLon});


    }).catch((err)=>{
    console.log(err);

    });

});

app.get("/speed", function(req, res){
    const data = require("./data.json");
    // res.send("hello ");
    //const stringObj = JSON.parse(data);
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



    const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: Number,
    GT: Number,
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
            GD: Number(obj[i].GD),
            GT: Number(obj[i].GT),
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

    let averageSpeed = 0;

    for(let i = 0; i < result.length; i++)
    {
        let speedArray = parseInt(result[i].SPA);
        averageSpeed = averageSpeed + parseInt(result[0].SPA);
    }
    averageSpeed = averageSpeed/result.length;

    res.render("speed",{title:averageSpeed});


    }).catch((err)=>{
    console.log(err);

    });
});

app.get("/overspeed", function(req, res){
    const data = require("./data.json");
    // res.send("hello ");
    //const stringObj = JSON.parse(data);
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



    const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: Number,
    GT: Number,
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
            GD: Number(obj[i].GD),
            GT: Number(obj[i].GT),
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


    let flag = 0;
    let averageSpeed = 0;

    for(let i = 0; i < result.length; i++)
    {
        let speedArray = parseInt(result[i].SPA);
        if(speedArray>overspeedingLimit)
        {
            flag = 1;
            break;
        }
    }
    if(flag==1)
    {
        res.render("overspeed2",{title:"Did overspeeding"});

    }
    else{
        res.render("overspeed2",{title:"Didn't overspeed"});

    }
    averageSpeed = averageSpeed/result.length;

        


    }).catch((err)=>{
    console.log(err);

    });
});

app.get("/distance", function(req, res){

    const data = require("./data.json");
    // res.send("hello ");
    //const stringObj = JSON.parse(data);
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



    const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: Number,
    GT: Number,
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
            GD: Number(obj[i].GD),
            GT: Number(obj[i].GT),
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
        // console.log(result[latest-1].T);
        let latLonStartingPoint = result[0].GA.split("|");

        let startPoint = latLonStartingPoint[0];

        let latLonEndingPoint = result[latest-1].GA.split("|");

        let endPoint = latLonEndingPoint[0];
        
        // let mixedLatLong = result[latest-1].GA;
    
    
    
        res.render("distance",{title:startPoint+"//"+endPoint});
    
    
        }).catch((err)=>{
        console.log(err);
    
        });
    
    // Distance calculating code...................................
    //   var R = 6371; // km
    //   var dLat = toRad(lat2-lat1);
    //   var dLon = toRad(lon2-lon1);
    //   var lat1 = toRad(lat1);
    //   var lat2 = toRad(lat2);

    //   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    //   var d = R * c;
    //   return d;

    // // Converts numeric degrees to radians
    // function toRad(Value) 
    // {
    //     return Value * Math.PI / 180;
    // }
    // //Distance calcuating code end -------xxxxxxxxxxxxxxx---------xxxxxxxx
    // res.render("distance");
});

app.get("/specificTimeDistance", function(req, res){
    const data = require("./data.json");
    // res.send("hello ");
    //const stringObj = JSON.parse(data);
    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );



    const vehicleUpdateSchema = new mongoose.Schema({
    T: String,
    GD: Number,
    GT: Number,
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
            GD: Number(obj[i].GD),
            GT: Number(obj[i].GT),
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


    vehicleUpdateData.find({GD: {$gte: 07012020},GT : {$gte : 080000}}, function (err, docs) {

        res.render("specificTimeDistance",{here:docs});
        console.log("And I am iron man"+docs)

    });
});
app.get("/specificTimeAverage", function(req, res){
    res.render("specificTimeAverage");
});

app.post("/specificTimeAverageGetResults", function(req, res){

    // const dataToString = JSON.stringify(data);
    // const obj = JSON.parse(dataToString);

    var data = req.body;

    res.render("home");
    console.log(data.date);
    console.log(data.start_time);
    console.log(data.end_time);
    
});
app.get("/addCar",function(req,res){

    const data = require("./cars.json");


    mongoose.connect("mongodb://localhost:27017/GPSTracker",{useNewUrlParser:true,useUnifiedTopology: true}).then(() => console.log("connection is successful")).catch((err) => console.log(err) );


    const createCarSchema = new mongoose.Schema({
        carName: String,
        carNumber: String,
        carColor: String,
        carModel: String,
        });
        const createCarData = new mongoose.model("createCarSchema",createCarSchema);

        
        const dataToString = JSON.stringify(data);
        const obj = JSON.parse(dataToString);

            

        for(let i = 0; i < obj.length; i++)
        {
        const newCarData = new createCarData(
            {
                carName: obj[i].carName,
                carNumber: Number(obj[i].carNumber),
                carColor: Number(obj[i].carColor),
                carModel: obj[i].F,
            }
        );
        
        newCarData.save();
        
        }
        res.render("where");
});

app.get("/specificTimeOverspeeding", function(req, res){
    res.render("specificTimeOverspeeding");
});

app.get("/liveLocationTrackerVehicle",function(req,res){
    res.sendFile(__dirname+"/maps.html");
});
