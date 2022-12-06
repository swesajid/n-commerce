"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromCDN = exports.uploadFileToCDN = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const misc_util_1 = require("./misc.util");
const fs_1 = __importDefault(require("fs"));
const NAMESPACE = 'Upload Utils';
const endpoint = process.env.DO_SPACES_ENDPOINT;
const region = process.env.DO_SPACES_REGION;
const key = process.env.DO_SPACES_ACCESS_KEY;
const secret = process.env.DO_SPACES_SECRET;
const bucket = process.env.DO_SPACES_BUCKET;
const spacesEndpoint = new aws_sdk_1.default.Endpoint(endpoint);
const s3 = new aws_sdk_1.default.S3({
    endpoint: spacesEndpoint,
    region,
    credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
    },
});
const uploadFileToCDN = (file, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unique_id = (0, misc_util_1.mkzID)();
        let params = { Bucket: bucket, ACL: 'public-read' };
        params.Key = `${unique_id}-${fileName}`;
        params.Body = fs_1.default.createReadStream(file.tempFilePath);
        const stored = yield s3.upload(params).promise();
        return stored.Location;
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'File upload error: ', err);
        return 'fail';
    }
});
exports.uploadFileToCDN = uploadFileToCDN;
const deleteFileFromCDN = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: bucket,
            Key: fileName,
        };
        yield s3.deleteObject(params).promise();
        return 'success';
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'File upload error: ', err);
        return 'fail';
    }
});
exports.deleteFileFromCDN = deleteFileFromCDN;
