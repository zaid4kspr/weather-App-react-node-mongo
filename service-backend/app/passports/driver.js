const passport = require('passport'),
    Driver = require('../models/Driver'),
    LocalStrategy = require('passport-local').Strategy,
    messages = require('../helpers/messages');

passport.use('driver-local', new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {
        Driver.findOne({
            'email': email,
            status: 'active'
        }, function (err, driver) {
            if (err) {
                console.log(err)
                return done(err)
            }
            if (!driver) {
                console.log('err')
                return done(null, false, {
                    message: messages.error_email
                })
            }
            if (!driver.validPassword(password)) {
                console.log('passerr')

                return done(null, false, {
                    message: messages.error_password
                })
            }

            return done(null, driver)
        })
    }
))

module.exports = passport
