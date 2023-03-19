import express from 'express'
const app = express()

import configRoutes from './routes/index.js'
configRoutes(app)



app.listen(3000, ()=>{
    console.log("Server Created");
    console.log('Your routes will be running on http://localhost:3000');
})