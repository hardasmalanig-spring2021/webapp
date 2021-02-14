const db = require("../loaders/db.loader");
const Book = db.book;

// checkNullRequestBook = (req, res) => {
//     if (Object.keys(req.body).length === 0) {
//         return res.status(400).send({
//             message: "Request Failed, Enter fields in Request body"
//         });
//     }  if (!req.body.title) {
//         return res.status(400).send({
//             message: "Request Failed,  title cannot be blank"
//         });
//     }
//      if (!req.body.author) {
//         return res.status(400).send({
//             message: "Request Failed, author cannot be blank"
//         });
//     }  if (!req.body.isbn) {
//         return res.status(400).send({
//             message: "Request Failed, isbn cannot be blank"
//         });
//     }  if (!req.body.published_date) {
//         return res.status(400).send({
//             message: "Request Failed,  pusblished date cannot be blank"
//         });
//     }
//     next();
// }

checkPublishedDate = (req,res, next) => {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
   // var pYear = req.body.published_date.getFullYear();
    var pMonth= req.body.published_date.getMonth();

    console.log(year,month, pMonth)
    next();
}

const bookValidation = {
  // checkNullRequestBook:checkNullRequestBook

  checkPublishedDate:checkPublishedDate
  };
  module.exports = bookValidation;