"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRoutes = void 0;
const express_1 = require("express");
const videoRepository_1 = require("../modules/videos/repositories/videoRepository");
const login_1 = require("../middleware/login");
const videoRoutes = (0, express_1.Router)();
exports.videoRoutes = videoRoutes;
const videoRepository = new videoRepository_1.VideoRepository();
videoRoutes.post("/publish-video", login_1.login, (request, response) => {
    videoRepository.create(request, response);
});
videoRoutes.get("/search-user-videos", login_1.login, (request, response) => {
    videoRepository.searchUserVideos(request, response);
});
videoRoutes.get("/search", (request, response) => {
    videoRepository.searchVideo(request, response);
});
