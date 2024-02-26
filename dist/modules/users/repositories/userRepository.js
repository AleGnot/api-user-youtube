"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ error: "Erro interno do servidor!" });
            }
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err);
                }
                connection.query("INSERT INTO users (id_user, username, email, password) VALUES (?,?,?,?)", [(0, uuid_1.v4)(), name, email, hash], (error, result, fields) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error);
                    }
                    response.status(200).json({ message: "Usuário criado com sucesso!" });
                });
            });
        });
    }
    login(request, response) {
        const { email, senha } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                return response.status(500).json({ error: "Erro interno do servidor!" });
            }
            connection.query("SELECT * FROM users WHERE email = ?", [email], (error, results, fields) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: "Erro na sua autenticação!" });
                }
                if (results.length === 0) {
                    return response.status(404).json({ error: "Não foi possivel encontrar o usuário" });
                }
                const user = results[0];
                (0, bcrypt_1.compare)(senha, user.password, (erro, result) => {
                    if (erro) {
                        return response.status(400).json({ error: "Erro na sua autenticação!" });
                    }
                    if (result) {
                        // JWT
                        const token = (0, jsonwebtoken_1.sign)({
                            id: user.id_user,
                            email: user.email
                        }, process.env.SECRET, { expiresIn: "1d" });
                        return response.status(200).json({ message: "Login efetuado com sucesso", token: token });
                    }
                    else {
                        return response.status(401).json({ error: "Senha Incorreta!" });
                    }
                });
            });
        });
    }
}
exports.UserRepository = UserRepository;
