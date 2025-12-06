import { morganStream } from "../config/logger.js";
import morgan from 'morgan';

morgan.token('body', (req) => {
    const body = { ...req.body };
    delete body.password;
    delete body.token;
    delete body.refreshToken;
    return JSON.stringify(body);
});

const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body';

export const requestLogger = morgan(logFormat, { stream: morganStream });