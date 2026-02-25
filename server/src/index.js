import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

import connectDb from './db/db1.js'
import app from './app.js'

import fs from 'fs';
import path from 'path';

connectDb()
    .then(() => {
        const port = process.env.PORT || 8000;
        const server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            fs.writeFileSync('server_startup.log', `Server started on port ${port} at ${new Date().toISOString()}\n`);
        });

        server.on('error', (err) => {
            console.error(`Server error: ${err.message}`);
            fs.appendFileSync('server_startup.log', `Server error: ${err.message} at ${new Date().toISOString()}\n`);
        });

        process.on('uncaughtException', (err) => {
            console.error(`Uncaught Exception: ${err.message}`);
            fs.appendFileSync('server_startup.log', `Uncaught Exception: ${err.message} at ${new Date().toISOString()}\n`);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error(`Unhandled Rejection: ${reason}`);
            fs.appendFileSync('server_startup.log', `Unhandled Rejection: ${reason} at ${new Date().toISOString()}\n`);
        });
    })
    .catch((err) => {
        console.error(`DB connection error: ${err.message}`);
        fs.writeFileSync('server_startup.log', `DB connection error: ${err.message} at ${new Date().toISOString()}\n`);
        process.exit(1);
    })
