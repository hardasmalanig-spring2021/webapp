const upload = require("../config/file.config");
const db = require("../loaders/db.loader");
const File = db.file;
const Book = db.book;
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/s3.config");
const { text } = require("body-parser");

const UUID = uuidv4();
const images = [];
const params = s3.uploadParams;
const deleteParams = s3.deleteParams;

exports.uploadImage = (req, res) => {
    const file_response = [];
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({
                message: "Request Failed, Error while uploading the file",
            });
        } else {
            let images = []
            for (let image of req.files) {
                const UUID = uuidv4();
                if (!image.originalname.match(/\.(jpg|jpeg|png)$/i)) {
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
                        Book.findByPk(file.book_id)
                            .then( (book) => {
                                if(book.book_images == null){
                                    images.push(file.get({ json: text }));
                                }else{
                                    images =  book.book_images;
                                    images.push(file.get({ json: text }));
                                }
                                
                              
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
                                        params.Key = file.s3_object_name;
                                        params.Body = image.buffer;
                                        s3.s3Client.upload(params, (err) => {
                                            if (err) {
                                                res.status(400).send({
                                                    message: "Unable to upload image to s3",
                                                });
                                            }
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
                                    })
                                    .catch((err) => {
                                        res.status(400).send({ message: err.message });
                                    });
                            })
                            .catch((err) => {
                                res.status(400).send({ message: err.message });
                            });
                    }).catch((err) => {
                        res.status(400).send({ message: err.message });
                    })
                }
            }
        }
    });
};

exports.deleteImage = (req, res) => {
    File.findByPk(req.params.image_id).then((file) => {
        if (!file) {
            return res.status(404).send({
                message: "Request Failed, Image not found",
            });
        }
        deleteParams.Key = file.s3_object_name;
        s3.s3Client.deleteObject(deleteParams, (err) => {
            if (err) {
                return res.status(400).send({
                    message: "Request Failed, Unable to delete image" + err,
                });
            } else {
                File.destroy({
                    where: {
                        file_id: req.params.image_id,
                    },
                })
                    .then(() => {
                        Book.findByPk(req.params.book_id)
                            .then((book) => {
                                const images = book.book_images.filter(
                                    (image) => image.file_id != req.params.image_id
                                );
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
                                    res.status(204).send();
                                });
                            })
                            .catch((err) => {
                                res.status(400).send({ message: err.message });
                            });
                    });
            }
        });
    });
};