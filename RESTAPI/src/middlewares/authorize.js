const authorized = () => {
  
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).send('Not authenticated!');
        } else {
            next();
        }

    }
}


module.exports.authorized = authorized;