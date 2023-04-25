import { Router } from "express";
import companyFunctions from "../data/company.js";
const router = Router();
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route("/").get((req, res) => {
  res.render("company/createCompany", { title: "Create Company" });
});

router.route("/data").post(upload.single("uploadImage"), async (req, res) => {
  const bodyData = req.body;
  // console.log(req.file);

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .render("error", { error: "There are no fields in the request body" });
  }

  // console.log(bodyData);
  let { companyName, industry, employee, location, description } = bodyData;
  let createdAt = new Date();
  
  try {
    const data = await companyFunctions.createComapny(
      companyName,
      industry,
      location,
      employee,
      description,
      createdAt,
      req.file.filename
    );

    // return res.json(data);
    return res.redirect(`/company/data/${data._id}`);
  } catch (e) {
    console.log(e);
    return res.status(500).render("error", { error: e });
  }
});

router.route("/data/:id").get(async (req, res) => {
  if (! req.params.id) "Error : Invalid User id"; // todo render a page;
  // return console.log(req.params.id);

  let companyData = await companyFunctions.getCompanyData( req.params.id );
  // console.log(companyData);

  return res.render("company/displayCompany", { title: "Create Company", companyData});
});

export default router;
