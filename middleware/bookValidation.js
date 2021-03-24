const db = require("../loaders/db.loader");
const Book = db.book;
const log = require("../log")
const logger = log.getLogger('logs');

checkNullRequestBook = (req, res, next) => {
  const errorResponses = {};
  if (Object.keys(req.body).length === 0) {
    logger.error("Error - Request Body Empty" );
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
    logger.error("Error - Incorrect request",errorResponses );
    return res.status(400).send(errorResponses);
  }
  next();
}

isbnValidation = (req,res,next) => {
  isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

  if(req.body.isbn){
    if(!isbnRegex.test(req.body.isbn)){
      logger.error("Error - Incorrect ISBN format" );
      return res.status(400).send({
        message: "Request Failed, ISBN can contain numbers, '-' and 10 or 13 digits"
      });
    }
  }
  next();
}

publishedDateValidation = (req,res,next) =>{
  dateRegex = /^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s?\d{0,2},\s+\d{4}/;

  if(req.body.published_date && !dateRegex.test(req.body.published_date)){
    logger.error("Error - Incorrect Date format" );
    return res.status(400).send({
      message: "Request Failed, Date should be in format Month, year or Month dd, yyyy like May, 2020"
    });
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
      logger.error("Error - ISBN already exists" );
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
  checkDuplicateISBN: checkDuplicateISBN,
  isbnValidation:isbnValidation,
  publishedDateValidation:publishedDateValidation

};
module.exports = bookValidation;