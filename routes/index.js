//Here you will import route files and export them as used in previous labs
import homeRoutes from "./home.js";
import signUpRoutes from "./signUp.js";
import logInRoutes from "./login.js";
import companyRoutes from "./company.js"

const constructorMethod = (app) => {
    app.use('/', homeRoutes);
    app.use('/logIn', logInRoutes);
    app.use('/signUp', signUpRoutes);
    app.use('/company', companyRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({error: "Page Not Found"});
    })
}

export default constructorMethod;