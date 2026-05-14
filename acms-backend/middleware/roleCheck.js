// middleware/roleCheck.js
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user is populated by your JWT verification middleware
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access Denied: You do not have the required permissions." 
            });
        }
        next();
    };
};

module.exports = checkRole;