const express = require('express'),
    mongoose = require('mongoose'),
    Admin = require('../models/Admin'),
    router = express.Router(),
    messages = require('../helpers/messages'),
    hat = require('hat'),
    axios = require('axios'),
    adminAuth = require("../middlewares/JWT").adminAuth;
const adminPassport = require('../passports/admin');

const winston = require('winston');
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({
            filename: 'log/error.log',
            level: 'error'
        }),
    ]
});


// **Admin things
// admin login
router.post('/admins/login', (req, res) => {
    try {
        adminPassport.authenticate('admin-local', function (err, admin, info) {
            let token;
            if (err) {
                return res.status(400).json({
                    message: "missing cred"
                });
            }
            if (admin) {
                token = admin.generateJwt();
                delete admin.password;
                res.status(200).json({
                    "user": admin,
                    "token": "Bearer " + token
                })
            }
            else {
                res.status(400).json(info);
            }
        })(req, res)

    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")

        res.status(501).json({
            message: messages.contact
        })
    }
})
//admin add
router.post('/admins/sociallogin', async (req, res) => {
    try {
        console.log(req.body)
        let admin = await Admin.findOne({
            email: req.body.email
        });
        if (admin) {
            console.log("admin maojoud")

            if (req.body.provider === "FACEBOOK") {
                if (admin.facebookId) {
                    if (admin.facebookId === req.body.id) {
                        let token = admin.generateJwt()
                        delete admin.password;
                        return res.status(200).json({
                            "user": admin,
                            "token": "Bearer " + token
                        });
                    } else {
                        return res.status(400).json({
                            message: messages.social_invalid_id
                        });
                    }
                } else {
                    admin.facebookId = req.body.id;
                    let token = admin.generateJwt();
                    delete admin.password;
                    res.status(200).json({
                        "user": admin,
                        "token": "Bearer " + token
                    })
                    await admin.save();
                    return;
                }

            } else if (req.body.provider === "GOOGLE") {
                console.log("dekhel b google")
                if (admin.googleId) {

                    if (admin.googleId === req.body.id) {

                        let token = admin.generateJwt()
                        delete admin.password;
                        console.log(admin, token)
                        return res.status(200).json({
                            "user": admin,
                            "token": "Bearer " + token
                        })
                    } else {
                        return res.status(400).json({
                            message: messages.social_invalid_id
                        });
                    }
                } else {

                    admin.googleId = req.body.id;
                    let token = admin.generateJwt();
                    delete admin.password;

                    console.log(admin)
                    console.log(token)

                    res.status(200).json({
                        "user": admin,
                        "token": "Bearer " + token
                    })
                    await admin.save();
                    return;
                }
            } else {
                return res.status(400).json({
                    message: "No admin found"
                });
            }
        } else {
            return res.status(400).json({
                message: "No admin found"
            });
        }
    } catch (error) {

        logger.error("=====================================")
        logger.error(error)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")

        return res.status(400).json({
            message: messages.contact
        });
    }
})



router.post('/admins', async (req, res) => {
    try {
        let admin = new Admin(req.body);
        admin.setPassword(req.body.password);
        await admin.save();
        res.status(200).json({
            message: messages.success_add
        });

    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")


        res.status(400).json({
            "message": messages.contact
        })
    }
})
router.get('/admins', adminAuth, async (req, res) => {
    try {
        let admins = await Admin.find({}).exec();
        if (admins) {
            return res.status(200).json(admins);
        } else {
            return res.status(400).json({
                message: messages.not_found
            });
        }
    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")


        res.status(502).json({
            "message": messages.contact
        });
    }
})
router.get('/admins/:id', adminAuth, async (req, res) => {
    try {
        let filter = {
            password: 0,
            reset_token: 0,
            reset_exp: 0,
        };

        let admin = await Admin.findById(req.params.id, filter).exec()
        if (admin) {
            return res.json(admin);
        } else {
            return res.status(400).json({
                message: messages.not_found
            })

        }
    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")


        res.status(400).json({
            "message": messages.contact
        })
    }
})
router.put('/admins/:id', adminAuth, async (req, res) => {

    try {
        let filter = {
            password: 0,
            reset_token: 0,
            reset_exp: 0,
        };
        let admin = await Admin.findById(req.params.id).exec();
        if (admin) {
            if (!admin.regions)
                admin.regions = []
            Object.assign(admin, req.body);
            console.log(admin.regions);
            // admin.markModified('regions');

            if (req.body.password)
                admin.setPassword(req.body.password);

            let done = await admin.save();
            if (done) {
                let admin = await Admin.findById(req.params.id, filter).exec();
                return res.status(201).json({
                    message: messages.success_update,
                    data: admin
                });
            } else {
                return res.status(400).json({
                    message: messages.error_update
                });
            }
        } else {
            return res.status(400).json({
                message: messages.not_found
            });
        }
    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")

        res.status(400).json({
            "message": messages.contact
        });
    }
})
router.delete('/admins/:id', adminAuth, async (req, res) => {
    try {

        let admin = await Admin.findByIdAndRemove(req.params.id).exec();
        if (admin) {
            return res.json({
                message: messages.error_remove
            });
        } else {
            return res.status(400).json({
                message: messages.error_remove
            });

        }
    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")

        res.status(400).json({
            "message": messages.contact
        });
    }

})
router.get('/admins/reset/:email', async (req, res) => {
    try {

        let admin = await Admin.findOne({
            email: req.params.email
        });
        if (admin) {
            admin.reset_token = hat();
            admin.reset_exp = new Date();
            admin.reset_exp.setDate(admin.reset_exp.getDate() + 1);
            let data = {
                data: admin,
                type: "reset"
            };
            await axios.post(process.env.NOTIF_HOST + "/notifications/email", data);
            await admin.save();
            return res.status(200).json({
                message: messages.success_reset
            });

        } else {
            return res.status(502).json({
                "message": messages.error_email
            });
        }

    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")

        res.status(502).json({
            "message": messages.contact
        });
    }
})
router.post('/admins/reset', async (req, res) => {
    try {
        let admin = await Admin.findOne({
            reset_token: req.body.token
        });
        var date = new Date()
        if (admin.reset_exp >= date) {
            admin.setPassword(req.body.password);
            admin.reset_token = null;
            await admin.save();
            res.status(200).json({
                'message': messages.success_password
            });

        } else {
            res.status(400).json({
                'message': messages.error_reset
            })
        }
    } catch (reason) {

        logger.error("=====================================")
        logger.error(reason)
        logger.error(JSON.stringify(req.body))
        logger.error(req.url)
        logger.error("=====================================")

        res.status(400).json({
            message: messages.contact
        });
    }
})

// **Admin things end.


module.exports = router;
