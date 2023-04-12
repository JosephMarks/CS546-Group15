import { Router } from "express";
import companyFunctions from "../data/company.js"
const router = Router();
import multer from "multer";                    

//var upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    return cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()} - ${file.originalname}`)
  }
})

const upload = multer({ storage })

router.route("/").get((req, res) => {
  return res.render('createCompany', {title: "Create Company"});
});

router.route('/data').post(upload.array('uploadImage', 5) ,async (req, res) => {
    const bodyData = req.body;
    console.log(req.file)
  
    if (!bodyData || Object.keys(bodyData).length === 0) {
      return res
        .status(400)
        .render('error', { error: "There are no fields in the request body" });
    }
    
    console.log(bodyData)
    let { companyName, industry, employee, location, description } = bodyData;

    try{
      const data = await companyFunctions.createComapny(companyName, industry, location, employee, "tag", description)
      return res.json(data)
    } catch (e) {
      console.log(e)
      return res.status(500).render('error', { error: e })
    }
    
})

export default router