const db = require("../loaders/db.loader");
var bcrypt = require("bcryptjs");
const User = db.user;

BasicAuth = (req, res, next) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    User.findOne({
        where: {
            username: username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Invalid Credentials. Please try again with valid credentials.' });
            }
            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password. Please try with a valid password"
                });
            }
            // attach user to request object
            req.user = user
            next()

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

const authentication = {
    BasicAuth: BasicAuth,
};

module.exports = authentication;
