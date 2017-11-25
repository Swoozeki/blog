const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const bcrypt = require('bcrypt');
AdminSchema.pre('save', function(next){
    const saltRounds = 10;
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        if(err){return next(err);}
        this.password = hash;
        next();
    });
});

AdminSchema.statics.authenticate = function(username, password, callback){
    this.findOne({username: new RegExp(username, 'i')}).exec((err, user)=>{
        if(err){return callback(err);}
        if(!user){return callback(new Error('User not found!'));}

        bcrypt.compare(password, user.password, (err, match)=>{
            return match?callback(null, user):callback(new Error('The password is incorrect!'));
        });
    });
};

module.exports = mongoose.model('Admin', AdminSchema);