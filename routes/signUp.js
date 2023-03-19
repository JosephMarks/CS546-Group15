import {Router} from 'express';
import signUpFunctions from '../data/signUp.js';

const router = Router()

router.route('/data').post(async (req, res) => {
    const bodyData = req.body;
    if (!bodyData || Object.keys(bodyData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
        const {fname, lname, age, email, password} = bodyData;
        const newData = await signUpFunctions.create(fname, lname, age, email, password);
        res.json(newData);
    } catch (e) {
        res.status(500).json({error: e});
    }

})

export default router