var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcryptjs');

module.exports = {
    register: (req, res) => {
        if(req.body.password){
            hashed_password = bcrypt.hashSync(req.body.password, 10)
            req.body.password = hashed_password;
        }
        let new_User = new User(req.body);
        new_User.save()
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.json(err)
        });
    },
    login: (req, res) => {
        User.findOne({email: req.body.email})
        .then (user => {
            if(user){
                bcrypt.compare(req.body.password, user.password)
                .then(isValid => {
                    if(isValid){
                        res.json(user)
                    } else {
                        res.json({errors: {password: {message: 'password incorrect'}}})
                    }
                })
                .catch(err => {
                    res.json(err)
                });
            } else {
                res.json({errors: {email: {message: 'email does not exist'}}})
            }
        })
        .catch(err => res.json(err));
    },
    // read: (req, res) => {
    //     User.findOne(req.params)
    //     .then(data => res.json(data))
    //     .catch(err => res.json(err));
    // },
    // update: (req, res) => {
    //     User.findOneAndUpdate(
    //         {_id: req.params},
    //         {$set:
    //             req.body
    //         },
    //         { 
    //             runValidators: true,
    //             context: 'query'
    //         }, error =>  res.json(error),
    //         {new:true});
    // },
    // destroy: (req, res) => {
    //     User.deleteOne(req.params)
    //     .then(data => res.json(data))
    //     .catch( err => res.json(err));
    // },

}