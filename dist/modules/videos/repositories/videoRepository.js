"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    create(request, response) {
        const { title, description, id_user } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ error: "Erro interno do servidor!" });
            }
            connection.query("INSERT INTO videos (id_video, id_user, title, description) VALUES (?,?,?,?)", [(0, uuid_1.v4)(), id_user, title, description], (error, result, fields) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error);
                }
                response.status(200).json({ message: "Video criado com sucesso!" });
            });
        });
    }
    searchUserVideos(request, response) {
        const { id_user } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ error: "Erro interno do servidor!" });
            }
            connection.query("SELECT * FROM videos WHERE id_user = ?", [id_user], (error, results, fields) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: "Erro na sua autenticação" });
                }
                if (results.length === 0) {
                    return response.status(404).json({ error: "Usuário não possui videos publicados" });
                }
                return response.status(200).json({ message: "Videos encontrados", videos: results });
            });
        });
    }
    searchVideo(request, response) {
        const { search } = request.query;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ error: "Erro interno do servidor!" });
            }
            connection.query("SELECT * FROM videos WHERE title LIKE ?", [`%${search}%`], (error, results, fields) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: "Erro na sua autenticação" });
                }
                if (results.length === 0) {
                    return response.status(404).json({ error: "Nenhum video encontrado" });
                }
                return response.status(200).json({ message: "Videos encontrados", videos: results });
            });
        });
    }
}
exports.VideoRepository = VideoRepository;
