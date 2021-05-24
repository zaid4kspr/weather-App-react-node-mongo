require('dotenv').config();

const adminSigner = process.env.ADMIN_SIGNER;
const jwt = require('jsonwebtoken');


module.exports.adminAuth = function (req, res, next) {
    try {
        let token = req.get('Authorization').substring(7);
        //test if user is admin
        jwt.verify(token, adminSigner, function (err, decoded) {
            if (err) {
                res.status(403).json({
                    "message": "Unauthorized access"
                })
            } else {
                req.body.onModel = "Admin"
                req["payload"] = {}
                req["payload"].usr = decoded

                next();
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            "message": "Unauthorized access"
        })
    }
};

