import chalk from 'chalk';

export default function logger(message: string, type: 'info' | 'warn' | 'debug' | 'error' = 'info', system: string) {
    const now = new Date();
    const timestamp = now.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const logType = type.toUpperCase();

    let coloredMessage: string;
    switch (type) {
        case 'info':
            coloredMessage = chalk.blue(`[${system}] ${process.pid} - ${timestamp}     ${logType} ${message}`);
            break;
        case 'warn':
            coloredMessage = chalk.yellow(`[${system}] ${process.pid} - ${timestamp}     ${logType} ${message}`);
            break;
        case 'debug':
            coloredMessage = chalk.magenta(`[${system}] ${process.pid} - ${timestamp}     ${logType} ${message}`);
            break;
        case 'error':
            coloredMessage = chalk.red(`[${system}] ${process.pid} - ${timestamp}     ${logType} ${message}`);
            break;
        default:
            coloredMessage = `[${system}] ${process.pid} - ${timestamp}     ${logType} ${message}`;
    }

    console.log(coloredMessage);
}