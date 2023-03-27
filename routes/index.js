import mainRoutes from "./routes.js"
import signUpRoutes from "./signUp.js"
import logInRoutes from "./login.js"

import  path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';


const __dirname = path.join(process.cwd(), '/');

const constructorMethod = (app) =>{

    app.use(express.json())
    app.use(express.static('public'));

    app.get("/signUp", (req, res) => res.sendFile(`${__dirname}/public/signup.html`));
    app.get("/logIn", (req, res) => res.sendFile(`${__dirname}/public/login.html`));

    app.use('/home', mainRoutes)
    app.use('/signUp/form', signUpRoutes)
    app.use('/logIn/form', logInRoutes)


    app.use('*', (req, res)=>{
        res.status(404).json({error: 'Page Not found'})
    })
}

export default constructorMethod