const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});
app.post("/",function(req,res){
   const firstName = req.body.fname;
   const lastName = req.body.lname;
   const email = req.body.email;
   console.log(firstName,lastName,email);
   var data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }

        }
    ]
   };
   const jsonData = JSON.stringify(data);
   const url = "https://us13.api.mailchimp.com/3.0/lists/53c2f465c0";
   const options = {
      method: "POST",
      auth: "sid:a2cb17706cc6581e4663a27697d3c0a8-us13"
   }
    const request = https.request(url,options,function(response){
       
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
             console.log(JSON.parse(data));
       });
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure",function(req,res){
    res.redirect("/");
});
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
//apikey
//a2cb17706cc6581e4663a27697d3c0a8-us13
//uniqueid
//53c2f465c0