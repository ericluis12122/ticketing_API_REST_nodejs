export default function admin(req, res, next) {
    if(req.user.role !== 'admin') 
        return res.status(403).json({message: 'Access denied. You do not have permition enough' });
    next();
}