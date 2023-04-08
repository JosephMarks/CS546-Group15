//Here you will import route files and export them as used in previous labs
import homeRoutes from "./home.js";
import signUpRoutes from "./signup.js";
import logInRoutes from "./login.js";

const constructorMethod = (app) => {
    app.use('/', homeRoutes);
    app.use('/logIn', logInRoutes);
    app.use('/signUp', signUpRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({error: "Page Not Found"});
    })
}

export default constructorMethod;