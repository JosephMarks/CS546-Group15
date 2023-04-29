import { Router } from "express";
const router = Router();

router.route('/').get(async (req, res) => {
    req.session.destroy();
    return res.render('Auth/login', {error: 'You are Logged out !'})
});

export default router;
