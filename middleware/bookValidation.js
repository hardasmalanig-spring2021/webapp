const db = require("../loaders/db.loader");
const Book = db.book;

checkNullRequestBook = (req, res, next) => {
  const errorResponses = {};
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Request Failed, Enter fields in Request body"
    });
  } if (!req.body.title || req.body.title === "") {
    errorResponses["Missing Title"] = "Request Failed, Title is a mandatory field";
  }
  if (!req.body.author || req.body.author === "") {
    errorResponses["Missing Author"] = " Request Failed, Author is a mandatory field";
  } if (!req.body.isbn || req.body.isbn === "") {
    errorResponses["Missing ISBN"] = "Request Failed, isbn is a mandatory field";
  } if (!req.body.published_date || req.body.published_date === "") {
    errorResponses["Missing Published Date"] = "Request Failed, Published date is a mandatory field";
  }

  if (Object.keys(errorResponses).length != 0) {
    return res.status(400).send(errorResponses);
  }
  next();
}

checkDuplicateISBN = (req, res, next) => {
  Book.findOne({
    where: {
      isbn: req.body.isbn,
    },
  }).then((book) => {
    if (book) {
      res.status(400).send({
        message: "Request Failed, ISBN already exists in the system ",
      });
      return;
    }
    next();
  });
};
const bookValidation = {
  checkNullRequestBook: checkNullRequestBook,
  checkDuplicateISBN: checkDuplicateISBN

};
module.exports = bookValidation;