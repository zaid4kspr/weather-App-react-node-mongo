var passport = require('passport'),
    Admin = require('../models/Admin'),
    LocalStrategy = require('passport-local').Strategy,
    messages = require('../helpers/messages')



passport.use('admin-local', new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {
        Admin.findOne({
            email: email,
        }, function (err, admin) {
            if (err) {
                console.log(err)
                return done(err)
            }
            if (!admin) {
                return done(null, false, {
                    message: messages.error_email
                })
            }
            if (!admin.validPassword(password)) {

                return done(null, false, {
                    message: messages.error_password
                })
            }

            return done(null, admin)
        })
    }
))

module.exports = passport
