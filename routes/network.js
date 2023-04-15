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

router.route('/post/:userid')
    .get(async (req, res) =>
    {
        try
        {
            req.params.userid = validation.checkId(req.params.userid)
        } catch(error)
        {
            return res.status(400).json({ error: error });
        }
        try
        {
            const userId = req.params.userid
            const title = "Post"
            const h1 = "Post";
            const userPostList = await networkData.getPostByUserId(req.params.userid);
            const followerPostList = await networkData.getPostByConnections(req.params.userid);
            res.render('networks/networkPost', { title: title, h1: h1, authorId: req.params.userid, userPost: userPostList, followerPost: followerPostList });
        } catch(error)
        {
            return res.status(404).json({ error: error });
        }

    })

router.route('/post/:userid/postId/:id')
    .get(async (req, res) =>
    {
        const post = await networkData.getPostById(req.params.id);
        const author = await userData.getUserById(post.userId);
        const title = post.content;
        const h1 = post.content;
        res.render('networks/yourPost', { title: title, h1: h1, post: post, fname: author.fname, lname: author.lname });
    })
    .post(async (req, res) =>
    {
        let updatedData = req.body.comments;
        let errors = [];
        try
        {
            req.params.id = validation.checkId(req.params.id, 'ID url param');
        } catch(e)
        {
            errors.push(e);
        }
        try
        {
            updatedData = validation.checkString(updatedData, 'Comment');
        } catch(e)
        {
            errors.push(e);
        }

        if(errors.length > 0) //Bugs
        {
            const post = await networkData.getPostById(req.params.id);
            const author = await userData.getUserById(post.userId);
            const title = post.content;
            const h1 = post.content;
            res.render('networks/yourPost', {
                title: title,
                h1: h1,
                post: post,
                fname: author.fname,
                lname: author.lname,
                errors: errors,
                hasErrors: true,
                newComments: updatedData,
            });
            return;
        }

        try
        {
            const updatedPost = await networkData.addComments(req.params.id, req.params.userid, updatedData);
            const post = await networkData.getPostById(req.params.id);
            const author = await userData.getUserById(req.params.userid);
            const title = post.content;
            const h1 = post.content;
            res.render(`networks/yourPost`, { title: title, h1: h1, post: post, fname: author.fname, lname: author.lname })
        } catch(e)
        {
            let status = e[0];
            let message = e[1];
            return res.status(status).json({ error: message });
        }
    }
    )

router.route('/follower/:id').get(async (req, res) =>
{
    const users = await userData.getUserById(req.params.id);
    res.render('networks/networkFollower', { users: users });
})

export default router;