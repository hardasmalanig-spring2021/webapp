const AWS = require("aws-sdk");
const env = require("./env.config");

const s3Client = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACESS_KEY,
    region: env.REGION,

});

const uploadParams = {
    Bucket: env.Bucket,
    Key: "",
    Body: null,
};

const deleteParams = {
    Bucket: env.Bucket,
    Key: ""
  }

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.deleteParams = deleteParams;

module.exports = s3;