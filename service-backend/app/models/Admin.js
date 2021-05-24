require("dotenv").config();
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    mongoosePaginate = require('mongoose-paginate-v2'),
    jwt = require('jsonwebtoken');

const saltRounds = 12;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
    },
    firstName: String,

    lastName: {
        type: String
    },
    password: {
        type: String
    },
    tel: {
        type: String,
    },
    image: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        /* 3: deleted, 1: active, 2: inactive*/
        enum: [1, 2, 3]
    },

    reset_exp: {
        type: Date,
        required: false
    },
    reset_token: {
        type: String,
        required: false
    },
    register_token: {
        type: String,
        required: false
    },
    superAdmin: {
        type: Number,
        enum: [0, 1]
    },
    userType: {
        type: String,
        default: "Admin"
    },
    fcmtokens: [],
    regions : {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

AdminSchema.plugin(mongoosePaginate);


AdminSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, saltRounds);
}
AdminSchema.methods.validPassword = function (password) {
    if (this.password) {
        return bcrypt.compareSync(password, this.password);

    } else {
        return false;
    }
}
AdminSchema.methods.generateJwt = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7) // token expire after 7 days
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        superAdmin: this.superAdmin,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.ADMIN_SIGNER);
}


const Admin = mongoose.model("Admin", AdminSchema)

module.exports = Admin
