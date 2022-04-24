const express = require("express");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const app = express();

aws.config.update({
  secretAccessKey: "",
  accessKeyId: "",
  region: "",
});

const BUCKET = "";
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3: s3,
    // access control list
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});

app.post("/upload", upload.single("file"), async function (req, res) {
  console.log(req.file);
  res.send(req.file.location);
});

// listing all the objects
app.get("/list", async (req, res) => {
  // using asynand promises here andstoring res invar 'r'
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  // filtering out only the names using map
  let x = r.Contents.map((item) => item.Key);
  res.send(x);
});

// another endpoint to downloadthe file
app.get("/download/:filename", async (req, res) => {
  const {
    config: { params, region },
  } = s3;
  const filename = req.params.filename;
  // let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
  const regionString = region.includes("us-east-1") ? "" : "-" + region;
  const url = `https://${BUCKET}.s3${regionString}.amazonaws.com/${filename}`;
  res.send(url);
});

// endpoint for deleting a file frms3

app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send("File deleted Successfully");
});

app.listen(3000, function () {
  console.log("server listening at 3000");
});
