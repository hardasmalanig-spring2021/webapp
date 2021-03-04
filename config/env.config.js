const env={
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    REGION: process.env.REGION,
    Bucket: process.env.Bucket_Name
};

module.exports = env;