// LOGGING CONFIGURATION | AUSTIN GINN 2023
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(), // Add a timestamp to log messages
        winston.format.json()
    ),
    defaultMeta: { service: 'tcl-automation' },
    transports: [
        new DailyRotateFile({
            filename: 'logs/tcl-automation-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(), // Add a timestamp to log messages
                winston.format.json()
            ),
        }),
        new DailyRotateFile({
            filename: 'logs/tcl-automation-%DATE%-combined.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(), // Add a timestamp to log messages
                winston.format.json()
            ),
        }),
    ]
});

export default logger;