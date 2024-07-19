const AWS = require("aws-sdk");
const fs = require("fs");
const moment = require("moment");
const { fill } = require("lodash");
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
  AWS_S3_REGION,
} = require("./constants");

AWS.config.update({
  region: AWS_S3_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

/**
 * Process promises in a parallel queue
 * @param {Array<any>} arr Array of promises
 * @param {(value: any, index: number, array: Array<any>) => any} func callback function
 * @param {number} threads Number of parallel processes
 * @returns
 */
async function parallel(arr, func, threads = 10) {
  if (!arr.length) return [];
  const data = [];
  await Promise.all(
    fill(Array(threads), arr.keys()).map(async (iterator) => {
      for (const i of iterator) {
        data[i] = await func(arr[i], i, arr);
      }
    })
  );
  return data;
}

const common = {
  parallel,
  print: (...msg) => console.log(moment().format(), ...msg),
  handleErrorResponse: (res, status = 500, message = "Something went Wrong") =>
    res.status(status).json({ success: false, message }),
  /**
   * @param {import("express").Response} res
   * @param {() => Promise<any>} action
   */
  api: async (res, action) => {
    try {
      await action();
    } catch (error) {
      console.log(error)
      common.handleErrorResponse(res);
      common.print(error);
    }
  },

  uploadFileToS3: (fileName, filePath) => {
    return new Promise((resolve) => {
      s3.upload(
        {
          Bucket: AWS_S3_BUCKET,
          Key: fileName,
          Body: fs.createReadStream(filePath),
        },
        (err, data) => {
          fs.unlinkSync(filePath); // delete file from our server
          if (err) {
            common.print("Error uploading file to AWS:", err);
            resolve(null);
          } else {
            resolve(data.Location);
          }
        }
      );
    });
  },
};

module.exports = common;
