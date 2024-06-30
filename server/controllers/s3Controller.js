require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();

async function uploadFile(folderName,fileName, data){
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folderName}/${fileName}`,
        Body: data,
        ACL: 'private'
    };

    return s3.upload(params).promise();
}

async function getFile(folderName,fileName){
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folderName}/${fileName}`,
    }

    const data = await s3.getObject(params).promise();

    return data.Body.toString('utf-8');

}

async function getTestData(problem_id){

    // lets just do it trivially now as we don't have multitests lol
    try{
        const input = await getFile(`${problem_id}/input`,'input.txt');
        const output = await getFile(`${problem_id}/output`,'output.txt');

        const data = {
            main_tests: input,
            expected_output: output
        };

        console.log("new data fetched",data);
        return data;
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

module.exports = {uploadFile,getTestData};