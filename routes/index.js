import mainRoutes from "./routes.js"
import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const constructorMethod = (app) =>{
    app.use(express.static('public'));
    app.get("/", (req, res) => res.sendFile(`${__dirname}/public/index.html`));
    app.use('/home', mainRoutes)
    app.use('*', (req, res)=>{
        res.status(404).json({error: 'Page Not found'})
    })
}

export default constructorMethod