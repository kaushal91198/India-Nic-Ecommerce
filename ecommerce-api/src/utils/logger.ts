// ================= Import Packages ===================
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
// =====================================================

// logs dir
const logDir = join(__dirname, process.env.LOG_DIR || '../../log');

if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
);

const logger = winston.createLogger({
    format: logFormat,
    transports: [
        // debug log setting
        new WinstonDaily({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}/debug`, // log file /logs/debug/*.log in save
            filename: '%DATE%.log',
            maxFiles: 30, // 30 Days saved
            json: false,
            zippedArchive: true,
        }),
        // error log setting
        new WinstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}/error`, // log file /logs/error/*.log in save
            filename: '%DATE%.log',
            maxFiles: 30, // 30 Days saved
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
    }),
);

const stream = {
    write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};

export { logger, stream, logFormat };
