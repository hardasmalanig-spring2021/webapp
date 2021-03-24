const upload = require("../config/file.config");
const db = require("../loaders/db.loader");
const File = db.file;
const Book = db.book;
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/s3.config");
const { text } = require("body-parser");
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../log")
const logger = log.getLogger('logs');

const params = s3.uploadParams;
const deleteParams = s3.deleteParams;

exports.uploadImage = (req, res) => {
    Metrics.increment('file.POST.uploadImage');
    let api_timer = new Date();
    logger.info("Upload File");
    let db_timer = new Date();
    const file_response = [];
    upload(req, res, (err) => {
        if (err) {
            logger.error("Error while uploading the file",err.message);
            return res.status(400).send({
                message: "Request Failed, Error while uploading the file",
            });
        } else {
            let images = []
            for (let image of req.files) {
                const UUID = uuidv4();
                if (!image.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                    logger.error("Error while uploading the file - Inforrect File Format");
                    return res
                        .status(400)
                        .send("Files with (.jpg, .jpeg, .png) format supported");
                } else {
                
                    File.create({
                        file_name: image.originalname,
                        s3_object_name: UUID + "/" + image.originalname,
                        user_id: req.user.id,
                        book_id: req.params.book_id,
                    }).then((file) => {
                        Metrics.timing('db.file.POST.createFile',db_timer);
                        let db_timer_book = new Date();
                        Book.findByPk(file.book_id)
                            .then( (book) => {
                                Metrics.timing('db.file.POST.findBookByPK',db_timer_book);
                                if(book.book_images == null){
                                    images.push(file.get({ json: text }));
                                }else{
                                    images =  book.book_images;
                                    images.push(file.get({ json: text }));
                                }
                                
                                let db_timer_book_update = new Date();
                                Book.update(
                                    {
                                        book_images: images,
                                    },
                                    {
                                        where: {
                                            id: file.book_id,
                                        },
                                    }
                                )
                                    .then(() => {
                                        Metrics.timing('db.file.POST.updateBook',db_timer_book_update);
                                        params.Key = file.s3_object_name;
                                        params.Body = image.buffer;
                                        let s3_timer = new Date();
                                        s3.s3Client.upload(params, (err) => {
                                            if (err) {
                                                logger.error("Error while uploading the file",err.message);
                                                res.status(400).send({
                                                    message: "Unable to upload image to s3",
                                                });
                                            }
                                            Metrics.timing('s3.file.POST.createFile',s3_timer);
                                        });
                                       file_response.push({
                                            file_name: file.file_name,
                                            s3_object_name: file.s3_object_name,
                                            file_id: file.file_id,
                                            file_created: file.file_created,
                                            user_id: file.user_id,
                                        });
                                        if (file_response.length == req.files.length) {
                                            res.status(201).send(file_response);
                                        }
                                        Metrics.timing('api.file.POST.uploadFile',api_timer);
                                    })
                                    .catch((err) => {
                                        logger.error("Error while uploading the file",err.message);
                                        res.status(400).send({ message: err.message });
                                    });
                            })
                            .catch((err) => {
                                logger.error("Error while uploading the file",err.message);
                                res.status(400).send({ message: err.message });
                            });
                    }).catch((err) => {
                        logger.error("Error while uploading the file",err.message);
                        res.status(400).send({ message: err.message });
                    })
                }
            }
        }
    });
};

exports.deleteImage = (req, res) => {
    Metrics.increment('file.DELETE.deleteImage');
    let api_timer = new Date();
    logger.info("Delete Image");
    let db_timer = new Date();
    File.findByPk(req.params.image_id).then((file) => {
        Metrics.timing('db.file.DELETE.findImage',db_timer);
        if (!file) {
            logger.error("Error while deleting the image - Image not found");
            return res.status(404).send({
                message: "Request Failed, Image not found",
            });
        }
        let s3_timer = new Date();
        deleteParams.Key = file.s3_object_name;
        s3.s3Client.deleteObject(deleteParams, (err) => {
            Metrics.timing('s3.file.DELETE.deleteImage',s3_timer);
            if (err) {
                logger.error("Error while deleting the image from s3",err.message);
                return res.status(400).send({
                    message: "Request Failed, Unable to delete image" + err,
                });
            } else {
                let db_timer = new Date();
                File.destroy({
                    where: {
                        file_id: req.params.image_id,
                    },
                })
                    .then(() => {
                        Metrics.timing('db.file.DELETE.destroyFile',db_timer);
                        let db_timer_findBook = new Date();
                        Book.findByPk(req.params.book_id)
                            .then((book) => {
                                Metrics.timing('db.file.DELETE.findBook',db_timer_findBook);
                                const images = book.book_images.filter(
                                    (image) => image.file_id != req.params.image_id
                                );
                                let db_timer_update = new Date();
                                Book.update(
                                    {
                                        book_images: images,
                                    },
                                    {
                                        where: {
                                            id: req.params.book_id,
                                        },
                                    }
                                ).then(() => {
                                    Metrics.timing('db.file.DELETE.findBook',db_timer_update);
                                    res.status(204).send();
                                });
                                Metrics.timing('api.file.DELETE.deleteFile',api_timer);
                            })
                            .catch((err) => {
                                logger.error("Error while deleting the file",err.message);
                                res.status(400).send({ message: err.message });
                            });
                    });
            }
        });
    });
};