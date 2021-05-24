const passport = require('passport'),
    User = require('../models/User'),
    LocalStrategy = require('passport-local').Strategy,
    messages = require('../helpers/messages');


passport.use('user-delivery', new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {
        User.findOne({
            'email': email.toLowerCase(),
            emailVerified: 1
        }, function (err, user) {
            if (err) {
                console.log(err)
                return done(err)
            }
            if (!user) {
                console.log('err')
                return done(null, false, {
                    message: messages.error_email
                })
            }
            if (!user.validPassword(password)) {
                console.log('passerr')

                return done(null, false, {
                    message: messages.error_password
                })
            }

            return done(null, user)
        })
    }
))

module.exports = passport
