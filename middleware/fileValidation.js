const db = require("../loaders/db.loader");
const File = db.file;
const Book = db.book;
const log = require("../log")
const logger = log.getLogger('logs');

checkBookAuth = (req, res, next) => {
    Book.findByPk(req.params.book_id)
        .then((book) => {
            if (!book) {
                logger.error("Error - Book not found" );
                return res
                    .status(404)
                    .send({ message: "Book not found" });
            } else if (book.user_id != req.user.id) {
                logger.error("Error - user not authorized to perform any action on this book " );
                return res.status(401).send({ message: "You are not authorized to perform any action on this book " });
            }
            next();
        })
        .catch((res, err) => {
            logger.error("Error - authorizing the user", err.message );
            res.status(400).send({
                message: err.message,
            });
        });
}

const fileValidation = {
    checkBookAuth: checkBookAuth,
}

module.exports = fileValidation;