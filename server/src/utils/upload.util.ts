import logger from '../config/logger';
import AWS from 'aws-sdk';
import { mkzID } from './misc.util';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';

const NAMESPACE = 'Upload Utils';

const endpoint = process.env.DO_SPACES_ENDPOINT as string;
const region = process.env.DO_SPACES_REGION as string;
const key = process.env.DO_SPACES_ACCESS_KEY as string;
const secret = process.env.DO_SPACES_SECRET as string;
const bucket = process.env.DO_SPACES_BUCKET as string;

const spacesEndpoint = new AWS.Endpoint(endpoint);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    region,
    credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
    },
});

export const uploadFileToCDN = async (file: UploadedFile, fileName: string): Promise<string | 'fail'> => {
    try {
        const unique_id = mkzID();
        let params: any = { Bucket: bucket, ACL: 'public-read' };

        params.Key = `${unique_id}-${fileName}`;
        params.Body = fs.createReadStream(file.tempFilePath);

        const stored = await s3.upload(params).promise();
        return stored.Location;
    } catch (err: any) {
        logger.error(NAMESPACE, 'File upload error: ', err);
        return 'fail';
    }
};

export const deleteFileFromCDN = async (fileName: string): Promise<'success' | 'fail'> => {
    try {
        const params = {
            Bucket: bucket,
            Key: fileName,
        };
        await s3.deleteObject(params).promise();
        return 'success';
    } catch (err: any) {
        logger.error(NAMESPACE, 'File upload error: ', err);
        return 'fail';
    }
};
