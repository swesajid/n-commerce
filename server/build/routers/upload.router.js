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
const express_1 = require("express");
const logger_1 = __importDefault(require("../config/logger"));
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_util_1 = require("../utils/error.util");
const upload_util_1 = require("../utils/upload.util");
const router = (0, express_1.Router)();
const NAMESPACE = 'Upload Image Router';
router.post('/', access_control_middleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALLOWED_EXTENSIONS = /png|jpg|jpeg|webp/;
        if (!req.files) {
            logger_1.default.error(NAMESPACE, 'No files received');
            return res.status(400).json((0, error_util_1.formatError)('No files received'));
        }
        const image = req.files.upload;
        const { imageName } = req.body;
        const extName = imageName.split('.')[imageName.split('.').length - 1];
        if (!ALLOWED_EXTENSIONS.test(extName)) {
            logger_1.default.error(NAMESPACE, 'Invalid file type');
            return res.status(400).json((0, error_util_1.formatError)('Only Image files are acceptable'));
        }
        // Will be removed after the CDN is introduced.
        const imageUrl = yield (0, upload_util_1.uploadFileToCDN)(image, imageName);
        if (imageUrl === 'fail') {
            return res.json({ imageUrl: '' });
        }
        res.json({ imageUrl });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Upload Error', err);
        res.json({ imageUrl: '' });
    }
}));
exports.default = router;
