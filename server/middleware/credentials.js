require('dotenv').config();

module.exports = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin === process.env.URI)
        res.header('Access-Control-Allow-Credentials', true);
    next();
}