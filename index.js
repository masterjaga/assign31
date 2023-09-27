const express = require("express");
const mongodb = require("mongodb");
const cors=require('cors');
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const port=process.env.PORT || 3036;
require('dotenv').config();
const app = express();
const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(cors());
// mongoClient.useUnifiedTopology=true;
// const port=process.env.PORT || 3036;
app.listen(port, () => console.log("your app runs with port:", port));  
app.get("/mentors", async (req, res) => {
       
  try {
    let clientInfo = await mongoClient.connect(dbURL);
  
    let db = await clientInfo.db("MentorStudent");
 
    let data = await db.collection("mentor").find().toArray();
    // res.status(200).json( data );
    res.send(data);
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
  
app.post("/mentor", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db.collection("mentor").insertOne(req.body);
    res.statusCode(200).json({ message: "Mentor created" });
    // res.send(data)
    clientInfo.close();
  } catch (error) {
    console.log(error);  
    res.status(500);
  }     
});
   
app.get("/mentor/:id", async (req, res) => {
  try {
    console.log("get user route", req.params.id);
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("mentor")
      .findOne({ _id: objectId(req.params.id) }, { "students":1});
    res.status(200).json(data ); 
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.put("/mentor/:name",async(req,res)=>{
  try {
    console.log("get user route", req.params.id);
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("mentor")
      .updateOne({ "name":req.params.name }, { $pull: { 'students': req.body.student}});
    res.status(200).json({ message:"User updated"});
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  }  
});

app.delete("/mentor/:id",async(req,res)=>{
   try {
     console.log("get user route", req.params.id);
     let clientInfo = await mongoClient.connect(dbURL);
     let db = clientInfo.db("MentorStudent");
     let data = await db
       .collection("mentor")
       .deleteOne({ _id: objectId(req.params.id) });
     res.status(200).json({ message: "User deleted" });
     clientInfo.close();
   } catch (error) {
     console.log(error);
     res.status(500);
   }
});

app.get("/students", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);

    let db = await clientInfo.db("MentorStudent");

    let data = await db.collection("student").find().toArray();
    res.send(data);
    // res.status(200).json(data); 
    
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  } 
});
    
app.post("/student", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db.collection("student").insertOne(req.body);
    res.status(200).json({ message: "Student created" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.get("/student/:name", async (req, res) => {
  try {
    // console.log("get user route", req.params.id); 
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("student")
      .findOne({ "name":req.params.name});
    res.status(200).json(data);
    res.send(data) ;
    clientInfo.close();
  } catch (error) {
    console.log(error);  
    res.send(500);  
  }
});     

app.put("/student", async (req, res) => {
  try {
    console.log("get user route", req.params.id);
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("student")
      .updateOne({ "name":req.body.student}, { $set: {"mentor":req.body.mentor} });
    res.status(200).json({ message: "User updated" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500); 
  }
});

app.delete("/student/:id", async (req, res) => {
  try {
    console.log("get user route", req.params.id);
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("student")
      .deleteOne({ _id: objectId(req.params.id) });
    res.status(200).json({ message: "User deleted" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}); 
 
app.put("/assign-student", async (req, res) => {
  try {
    console.log("get user route", req.params.id);
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("mentor")
      .updateOne({ "name":req.body.mentor }, { $push: {"students":req.body.student}});   
    res.status(200).json({ message: "User updated" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);  
  }
});    
app.put("/assign-mentor/:id", async (req, res) => {
  try {
    console.log("get user route", req.params.id);
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("MentorStudent");
    let data = await db
      .collection("student")
      .updateOne(
        { _id: objectId(req.params.id) },
        { $set: { "mentor": "mentor" } }
      );
    res.status(200).json({ message: "User updated" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
