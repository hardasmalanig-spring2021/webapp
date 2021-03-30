const bookService = require("../services/book.service");
const auth = require("../middleware/basicAuthentication");
const { bookValidation } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        req.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/books",
        [
            auth.BasicAuth,
            bookValidation.checkNullRequestBook,
            bookValidation.isbnValidation,
            bookValidation.checkDuplicateISBN,
            bookValidation.publishedDateValidation

        ],
        bookService.createBook
    );

    app.get("/books/:id",
        bookService.getBook
    );

    app.delete("/books/:id",
        [
            auth.BasicAuth,

        ],
        bookService.deleteBook
    );

    app.get("/allbooks",
        bookService.getAllBooks
    );
}