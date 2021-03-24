const db = require("../loaders/db.loader");
var bcrypt = require("bcryptjs");
const User = db.user;
const log = require("../log")
const logger = log.getLogger('logs');

BasicAuth = (req, res, next) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.error("Missing Authorization header" );
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
                logger.error("Invalid Credentials." );
                return res.status(401).json({ message: 'Invalid Credentials. Please try again with valid credentials.' });
            }
            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );
            if (!passwordIsValid) {
                logger.error("Invalid Password." );
                return res.status(401).send({
                    message: "Invalid Password. Please try with a valid password"
                });
            }
            // attach user to request object
            req.user = user
            next()
        })
        .catch(err => {
            logger.error("Error Authenticating the user",err.message );
            res.status(500).send({ message: err.message });
        });
};

const authentication = {
    BasicAuth: BasicAuth,
};

module.exports = authentication;
