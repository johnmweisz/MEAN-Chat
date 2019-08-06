var users = require('../controllers/users.js');

module.exports = app => {
    app.post('/user/register', (req, res) => {users.register(req, res);});
    app.post('/user/login', (req, res) => {users.login(req, res);});
}