const { book } = require("../loaders/db.loader");
const db = require("../loaders/db.loader");
const Book = db.book;
const User = db.user;
const File = db.file;
const s3 = require("../config/s3.config");
const deleteParams = s3.deleteParams;
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../log")
const logger = log.getLogger('logs');


//create book with basic auth
exports.createBook = (req, res) => {
  Metrics.increment('book.POST.createBook');
  let api_timer = new Date();
  logger.info("Create Book");
  let db_timer = new Date();
    User.findOne({
        where: {
            username: req.user.username
        }
    }).then(user => {
      Metrics.timing('db.book.POST.createBook.findUser',db_timer);
        if (!user) {
            logger.error("Error while creating the book, User Not found");
            return res.status(404).send({ message: "User Not found" });
        } else {
          let db_timer1 = new Date();
            Book.create({
                title: req.body.title,
                author: req.body.author,
                isbn: req.body.isbn,
                published_date: req.body.published_date,
                user_id: user.id
            }).then(book => {
              Metrics.timing('db.book.POST.createBook',db_timer1);
                res.status(201).send({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    published_date: book.published_date,
                    book_created: book.book_created,
                    user_id: book.user_id,
                    book_images: book.book_images || []
                });
                Metrics.timing('api.user.POST.createBook',api_timer);
            }).catch(err => {
                logger.error("Error while creating the book",err.message);
                res.status(400).send({ message: err.message });
            });
        }
    })



}

//Find book by id with basic auth
exports.getBook = (req, res) => {
    Metrics.increment('book.GET.getBookByID');
    let api_timer = new Date();
    logger.info("Get book by ID");
    let db_timer = new Date();
    Book.findByPk(req.params.id).then(book => {
      Metrics.timing('api.book.GET.getBookByID',db_timer);
        if (!book) {
            logger.error("Error while getting the book, Book Not found");
            return res.status(404).send({ message: "Book Not found." });
        }
        
        res.status(200).send({
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            published_date: book.user,
            book_created: book.book_created,
            user_id: book.user_id,
            book_images: book.book_images || [],
        });
        Metrics.timing('api.book.GET.getBookByID',api_timer);
    }).catch(err => {
      logger.error("Error while getting the bookdetails",err.message);
        res.status(400).send({ message: err.message });
    });
}

exports.deleteBook = (req, res) => {
  Metrics.increment('book.DELETE.deleteBook');
  let api_timer = new Date();
  logger.info("elete Book by Id");
  let db_timer = new Date();
    Book.findByPk(req.params.id).then((book) => {
      Metrics.timing('db.book.DELETE.deleteBook.findBook',db_timer);
      if (!book) {
        logger.error("Error deleting the book, Book Not found");
        return res
          .status(404)
          .send({ message: "Request Failed, Book Not Found" });
      } else if (book.user_id != req.user.id) {
        logger.error("Error Deleteing book, User is not authorized to delete the book")
        return res
          .status(401)
          .send({ message: "Request Failed Unauthorized User." });
      } else {
        let db_timer_file = new Date();
        
        File.findAll({
          raw: true,
          where: {
            book_id: req.params.id,
          },
        }).then((files) => {
          Metrics.timing('db.book.DELETE.deleteBook',db_timer_file);
          let s3_timer = new Date();
          for (let file of files) {
            deleteParams.Key = file.s3_object_name;
            s3.s3Client.deleteObject(deleteParams, (err) => {
              if (err) {
                return res.status(400).send({
                  message: "Unable to delete image from s3" + err,
                });
              }
            });
          }
          Metrics.timing('s3.book.DELETE.deleteBook',s3_timer);
          let db_timer = new Date();
          Book.destroy({
            where: {
              id: req.params.id,
              user_id: req.user.id,
            },
          })
            .then(() => {
              Metrics.timing('db.book.DELETE.deleteBook',db_timer);
              res.status(204).send();
              Metrics.timing('api.book.DELETE.deleteBook',api_timer);
            })
            .catch((err) => {
              logger.error("Error deleting the book",err.message);
              res.status(400).send({ message: err.message });
            });
        });
      }
    });
  };

//get all books
exports.getAllBooks = (req, res) => {
  Metrics.increment('book.GET.getAllBooks');
  let api_timer = new Date();
  logger.info("Get All books ");
  let db_timer = new Date();
    Book.findAll({ raw: true }).then(book => {
      Metrics.timing('api.book.GET.getAllBooks',db_timer);
        if (!book) {
          logger.error("Error when trying to get all the books, No books in database");
            return res.status(404).send({ message: "There are no books in the database" });
        }
        res.status(200).send(book);
        Metrics.timing('api.book.GET.getAllBooks',api_timer);

    }).catch(err => {
      logger.error("Error when trying to get all the books",err.message);
        res.status(400).send({ message: err.message });
    });
}