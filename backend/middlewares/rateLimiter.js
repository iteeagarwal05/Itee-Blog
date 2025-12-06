import rateLimit from 'express-rate-limit';
import { logger } from '../config/logger.js';

const createLimiter = (options) => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        statusCode: 429, // Too Many Requests
        message: 'Too many requests from this IP, please try again later',
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: (req, res) => {
            logger.console.warn('Rate Limit Exceeded', {
                ip: req.ip,
                path: req.path,
            });
            res.status(429).json({
                error: 'Too many requests from this IP, please try again later',
                retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
            })
        },
        ...options
    })
}

export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window per IP
    message: 'Too many authentication attempts, please try again after 15 minutes'
});

export const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per window per IP
});

export const createBlogLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 blog posts per hour
    message: 'Blog post creation limit reached, please try again later'
});