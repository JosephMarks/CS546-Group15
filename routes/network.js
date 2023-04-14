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
            const title = "Network";
            res.render('networks/network', { title: title, h1: h1 });
        } catch(e)
        {
            res.status(500).json({ error: e });
        }
    })

router.route('/post/:id')
    .get(async (req, res) =>
    {
        const title = "Post"
        const h1 = "Post";
        const userPostList = await networkData.getPostByUserId(req.params.id);
        const followerPostList = await networkData.getPostByConnections(req.params.id);
        res.render('networks/networkPost', { title: title, h1: h1, userPost: userPostList, followerPost: followerPostList });
    })

router.route('/post/yourpost/:id')
    .get(async (req, res) =>
    {
        const post = await networkData.getPostById(req.params.id);
        const author = await userData.getUserById(post.userId);
        const title = post.content;
        const h1 = post.content;
        res.render('networks/yourPost', { title: title, h1: h1, post: post, fname: author.fname, lname: author.lname });
    })

router.route('/follower/:id').get(async (req, res) =>
{
    const users = await userData.getUserById(req.params.id);
    res.render('networks/networkFollower', { users: users });
})

export default router;