import { MongoClient } from "mongodb";

function handler(req, res){
    if(req.method !== "POST") return;
    const {name, email, password}=req.body;
    con

}