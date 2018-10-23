const User = require('../models/user.model');

exports.create = (req, res)=> {
    let user = new User(
        {
            name: req.body.name,
            phone: req.body.phone
        }
    );
    user.save();
    res.status(201).send(user) 
};

exports.get_users = (req, res)=> {
    User.find({}, (err, users) => {
        if(err) res.status(500).json({error: "Internal server error"});
        res.status(200).json(users)
    });
};

exports.get = (req, res)=> {
    User.findOne({phone:req.params.phone}, (err, user) => {
        if (err) {
            res.status(500).json({error:"Inter server error!"})
        }
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({error:"Not Found"})
        }
    })  
};

exports.update = (req, res)=> {
    User.findOneAndUpdate({phone:req.params.phone}, req.body, (err, user) => {
        if (err) {
            res.status(404).json({error:"Not Found!"})
        }
        res.status(200).json(user)
    })
};

exports.delete = (req, res)=> {
    console.log(req.params.phone);
    User.findOneAndRemove({phone:req.params.phone}, (err, user) => {
        if (err) {
            res.status(404).json({"error":"Not Found!"});
        }
        else {
            res.status(204).json({"message":"Deleted"});     
        }
    })
};