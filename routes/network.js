import { Router } from "express";
const router = Router();
import { networkData, userData } from '../data/index.js';
import validation from '../helpers.js';

router
    .route('/')
    .get(async (req, res) =>
    {
        try
        {
            const h1 = "Network";
            const title = "network";
            res.render('./network', { title: title, h1: h1 });
        } catch(e)
        {
            res.status(500).json({ error: e });
        }
    })

router.route('/new/:id').get(async (req, res) =>
{
    const users = await userData.getUserById(req.params.id);
    res.render('./networkCreate', { users: users });
})

router.route('/id/:id').get(async (req, res) =>
{
    const users = await userData.getUserById(req.params.id);
    res.render('./networkYourPost', { users: users });
})

router.route('/follower/:id').get(async (req, res) =>
{
    const users = await userData.getUserById(req.params.id);
    res.render('./networkFollower', { users: users });
})

export default router;