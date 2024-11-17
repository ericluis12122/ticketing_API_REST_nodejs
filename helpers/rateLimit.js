import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100 // limit each IP to 100 request per windowMs
});

export default limiter;