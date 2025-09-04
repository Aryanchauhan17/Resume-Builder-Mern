const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //attach decoded user info to req.user 
            req.user = decoded;

            next();
        } catch(error) {
            console.log(error);
            return res.status(401).json({message: "Not authorized, token failed"});

            
        }
    }

    if(!token) {
        return res.status(401).json({message: "Not authorized, no token"});
    }
};

module.exports = protect;