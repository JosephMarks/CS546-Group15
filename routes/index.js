import mainRoutes from "./routes.js"
import signUpRoutes from "./signUp.js"
import { dirname } from 'path';
import express from 'express';
import bodyParser from 'express';
import { fileURLToPath } from 'url';
//const __dirname = dirname(fileURLToPath(import.meta.url));
const __dirname = dirname("/home/pp/Downloads/CS546-Group15/public/");

const constructorMethod = (app) =>{
    app.use(bodyParser.urlencoded())
    app.use(express.static('public'));
    app.get("/", (req, res) => res.sendFile(`${__dirname}/public/signup.html`));
    app.get("/signUp", (req, res) => res.sendFile(`${__dirname}/public/signup.html`));
    app.use('/home', mainRoutes)
    app.use('/signUp/form', signUpRoutes)
    app.use('*', (req, res)=>{
        res.status(404).json({error: 'Page Not found'})
    })
}

export default constructorMethod