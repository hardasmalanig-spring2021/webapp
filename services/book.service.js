const { book } = require("../loaders/db.loader");
const db = require("../loaders/db.loader");
const Book = db.book;
const User = db.user;

//create book with basic auth
exports.createBook = (req, res) => {
    User.findOne({
        where: {
            username: req.user.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found" });
        } else {
            Book.create({
                title: req.body.title,
                author: req.body.author,
                isbn: req.body.isbn,
                published_date: req.body.published_date,
                user_id: user.id
            }).then(book => {
                res.status(201).send({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    published_date: book.published_date,
                    book_created: book.book_created,
                    user_id: book.user_id
                });
            }).catch(err => {
                res.status(400).send({ message: err.message });
            });
        }
    })



}

//Find book by id with basic auth
exports.getBook = (req, res) => {
    Book.findByPk(req.params.id).then(book => {
        if (!book) {
            return res.status(404).send({ message: "Book Not found." });
        }
        res.status(200).send({
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            published_date: book.published_date,
            book_created: book.book_created,
            user_id: book.user_id
        });

    }).catch(err => {
        res.status(400).send({ message: err.message });
    });
}

//Delete book with id
exports.deleteBook = (req, res) => {
    Book.findOne({
        where: {
            id: req.params.id
        }

        // user_id = req.user.id
    }).then(book => {
        if (!book) {
            return res.status(404).send({ message: "Book Not found." });
        }
       else if (book.user_id != req.user.id) {
            return res.status(401).send({ message: "You are not authorized to delete this book" });
        }
        
        Book.destroy({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }

        }).then(Book => {
            res.status(204).send({})
        })
    })

}

//get all books
exports.getAllBooks = (req,res) => {
    Book.findAll({raw:true}).then(book => {
        if (!book) {
            return res.status(404).send({ message: "There are no books in the database" });
        }
        res.status(200).send(book);

    }).catch(err => {
        res.status(400).send({ message: err.message });
    });
}