const multer = require('multer')

module.exports.diskStorage = () => {

    return multer.diskStorage({
        destination: function (req, file, cb) {
            console.log(req);
            cb(null, 'upload/');
        },

        filename: function (req, file, cb) {
            console.log(req)
            console.log(file)

            cb(null, Date.now() + file.originalname)
        }
    })
}

module.exports.storage = () => {
    return multer({
        storage: this.diskStorage(),
        limits: {
            fieldSize: 50 * 1024 * 1024
        }
    })

}
