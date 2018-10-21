const User = require('../models/user.model');

//Simple version, without validation or sanitation
exports.create = (req, res)=> {
    console.log(req.body)
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
        res.status(200).json(users)
    })  
};

exports.get = (req, res)=> {
    User.findOne({phone:req.params.phone}, (err, user) => {
        if (err) {
            res.status(404).json({error:"Not Found!"})
        }
        res.status(200).json(user)
    })  
};

exports.update = (req, res)=> {
    res.send('Greetings from the Test controller! : Update');
    console.log(req.body)
};