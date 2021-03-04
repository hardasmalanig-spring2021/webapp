const db = require("../loaders/db.loader");
const File = db.file;
const Book = db.book;

checkBookAuth = (req, res, next) => {
    Book.findByPk(req.params.book_id)
        .then((book) => {
            if (!book) {
                return res
                    .status(404)
                    .send({ message: "Book not found" });
            } else if (book.user_id != req.user.id) {
                return res.status(401).send({ message: "You are not authorized to perform any action on this book " });
            }
            next();
        })
        .catch((res, err) => {
            res.status(400).send({
                message: err.message,
            });
        });
}

const fileValidation = {
    checkBookAuth: checkBookAuth,
}

module.exports = fileValidation;