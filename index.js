const express=require('express');
const cors=require('cors');
require('dotenv').config();
require("./db/config");
const User=require("./db/User");
const Product=require("./db/Product");

const port = process.env.PORT || 3001;

const app=express();

app.use(express.json());
app.use(cors());

app.post("/register",async (req,res)=>{
    let user=new User(req.body);
    let result=await user.save();
    result=result.toObject();
    delete result.password;
    res.send(result);
});


  
app.get("/get-user/:id", async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (user) {
        res.json({ name: user.name }); // Return the name as a JSON object
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

app.post("/login",async(req,res)=>{
    console.log(req.body);
    if(req.body.password && req.body.email){
        let user=await User.findOne(req.body).select("-password");
        if(user){
            res.send(user);
        }else{
            res.send({result:"No User Found"});
        }
    }else{
        res.send({result:"No User Found"});
    }
    
     
});

app.post("/add-product" ,async (req,res)=>{
   let product=new Product(req.body);
   let result=await product.save();
   res.send(result);
});

app.get("/all-product",async(req,res)=>{
    let products=await Product.find();
    if(products.length>0){
        res.send(products);
    }else{
        res.send({result:"No Product Found"});
    }
    
});

app.delete("/delete-product/:id",async(req,res)=>{
    const result=await Product.deleteOne({_id:req.params.id})
    res.send(result);
});

app.get("/get-single-product/:id",async(req,res)=>{
    const result=await Product.findOne({_id:req.params.id});
    if(result){
        res.send(result);

    }else{
        res.send({result:"No Product Found"});
    }
});

app.put("/update-product/:id",async(req,res)=>{
    let result= await Product.updateOne({_id:req.params.id},{$set :req.body});
    res.send(result);
   
});

app.get("/search/:key",async(req,res)=>{
    let result=await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}
        ]
    });
    res.send(result);
});

app.listen(port);

