//Here you will import route files and export them as used in previous labs
import homeRoutes from "./home.js";
import signUpRoutes from "./signUp.js";
import logInRoutes from "./login.js";
import companyRoutes from "./company.js";
import groupRoutes from "./groups.js";
import teamRoutes from "./team.js";
import socialPostRoutes from "./socialPost.js";
import networkRoutes from "./network.js";
import profileRoutes from "./profile.js";
import skillsRoutes from "./skills.js";
import logoutRoutes from "./logout.js";
import allCompanyRoutes from "./allCompany.js";
import recommendationRoutes from "./recommendation.js"
import referralRoutes from "./referral.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/logIn", logInRoutes);
  app.use("/signUp", signUpRoutes);
  app.use("/company", companyRoutes);
  app.use("/groups", groupRoutes);
  app.use("/team", teamRoutes);

  app.use("/network", networkRoutes);
  app.use("/skills", skillsRoutes);
  app.use("/profile", profileRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/allCompany", allCompanyRoutes);
  app.use("/recommendation", recommendationRoutes);

  app.use("/socialmediaposts", socialPostRoutes);
  app.use("/referral", referralRoutes);
  // app.use("/profile", profileRoutes); Will update momentarily

  app.use("*", (req, res) => {
    res.status(404).render('error', { error: "Page Not Found" });
  });
};

export default constructorMethod;
