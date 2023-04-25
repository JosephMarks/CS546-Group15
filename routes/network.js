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
            res.redirect(`/network/post/${req.session.user.userId}`)
            // return res.render('networks/network', { title: title, h1: h1 });
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
            return res.render('networks/networkPost', { title: title, h1: h1, authorId: req.params.userid, userId: req.params.userid, userPost: userPostList, followerPost: followerPostList });
        } catch(error)
        {
            return res.status(404).json({ error: error });
        }

    })


router.route('/post/:userid/new')
    .get(async (req, res) =>
    {
        // const users = await userData.getAllUsers();
        res.render('networks/createNewPost', { title: "New Post", h1: "New Post", userId: req.params.userid });
    })
    .post(async (req, res) =>
    {
        let post = req.body.post;
        let errors = [];
        try
        {
            post = validation.checkString(post, 'Post');
        } catch(e)
        {
            errors.push(e);
        }

        if(errors.length > 0)
        {
            res.render('createNewPost', {
                errors: errors,
                hasErrors: true,
                post: post,
                userId: req.params.userid
            });
            return;
        }

        try
        {
            const newPost = await networkData.addPost(req.params.userid, post);
            res.redirect(`/network/post/${req.params.userid}`);
        } catch(e)
        {
            res.status(500).json({ error: e });
        }
    })

router.route('/post/:userid/postId/:id')
    .get(async (req, res) =>
    {
        const post = await networkData.getPostById(req.params.id);
        const author = await userData.getUserById(post.userId);
        const title = post.content;
        const h1 = post.content;
        res.render('networks/yourPostComments', { title: title, userId: req.params.userid, h1: h1, post: post, fname: author.fname, lname: author.lname });
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

        if(errors.length > 0)
        {
            const post = await networkData.getPostById(req.params.id);
            const author = await userData.getUserById(post.userId);
            const title = post.content;
            const h1 = post.content;
            res.render('networks/yourPostComments', {
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
        } catch(e)
        {
            let status = e[0];
            let message = e[1];
            return res.status(status).json({ error: message });
        }
        res.redirect(`/network/post/${req.params.userid}`)
    }
    )

router.route('/post/:userid/postId/:id/edit')
    .get(async (req, res) =>
    {
        const post = await networkData.getPostById(req.params.id);
        const author = await userData.getUserById(post.userId);
        const title = post.content;
        const h1 = post.content;
        res.render('networks/yourPostEdit', { title: title, h1: h1, post: post, userId: req.params.userid });
    })

    .patch(async (req, res) =>
    {
        let userId = req.params.userid;
        let postId = req.params.id;
        let content = req.body.content;
        try
        {
            userId = validation.checkId(userId, 'User ID');
            postId = validation.checkId(postId, "Post ID");
            if(content)
                content = validation.checkString(content, 'Content');
        } catch(e)
        {
            return res.status(400).json({ error: e });
        }

        try
        {
            const userIdByPostId = await networkData.getPostById(postId);
            if(userIdByPostId.userId !== userId)
                throw "Error: You have no right to modify this post!"
        } catch(e)
        {
            return res.status(400).json({ error: e });
        }

        try
        {
            const updatedPost = await networkData.updatePost(
                postId,
                content
            );
            res.redirect(`/network/post/${userId}`);
        } catch(e)
        {
            let status = e[0];
            let message = e[1];
            res.status(status).json({ error: message });
        }
    })

router.route('/post/:userid/postId/:id/remove')
    .get(async (req, res) =>
    {
        const post = await networkData.getPostById(req.params.id);
        const author = await userData.getUserById(post.userId);
        const title = post.content;
        const h1 = post.content;
        res.render('networks/yourPostRemove', { title: title, h1: h1, post: post, userId: req.params.userid });
    })
    .delete(async (req, res) =>
    {
        let userId = req.params.userid;
        let postId = req.params.id;
        try
        {
            userId = validation.checkId(userId, 'User ID');
            postId = validation.checkId(postId, "Post ID");
        } catch(e)
        {
            return res.status(400).json({ error: e });
        }

        try
        {
            let deletedPost = await networkData.removePost(postId);
            return res.redirect(`/network/post/${userId}`);
        } catch(e)
        {
            let status = e[0];
            let message = e[1];
            res.status(status).json({ error: message });
        }
    }
    )


router.route('/post/:userId/followerId/:followerId/postId/:postId')
    .get(async (req, res) =>
    {
        let post, author;
        try
        {
            post = await networkData.getPostById(req.params.postId);
        } catch(e)
        {
            return res.status(400).json({ error: e });
        }
        try
        {
            author = await userData.getUserById(req.params.followerId)
        } catch(e)
        {
            errors.push(e)
        }

        const title = post.content;
        const h1 = post.content;
        res.render('networks/followerPostComments', { title: title, h1: h1, post: post, userId: req.params.userId, followerId: post.userId, author: author });
    })
    .post(async (req, res) =>
    {
        let updatedData = req.body.comments;
        let errors = [];
        let post, author;
        try
        {
            updatedData = validation.checkString(updatedData, "Comments");
        } catch(error)
        {
            errors.push(error)
        }

        try
        {
            post = await networkData.getPostById(req.params.postId);
        } catch(e)
        {
            errors.push(e)
        }

        try
        {
            author = await userData.getUserById(req.params.followerId)
        } catch(e)
        {
            errors.push(e)
        }

        if(errors.length > 0)
        {
            const title = post.content;
            const h1 = post.content;
            res.render('networks/followerPostComments', {
                title: title,
                h1: h1,
                post: post,
                author: author,
                errors: errors,
                hasErrors: true,
                newComments: updatedData,
            });
            return;
        }

        try
        {
            const updatedPost = await networkData.addComments(req.params.postId, req.params.userId, updatedData);
        } catch(e)
        {
            let status = e[0];
            let message = e[1];
            return res.status(status).json({ error: message });
        }
        res.redirect(`/network/post/${req.params.userId}`)
    }
    )

router.route('/follower/:userId')
    .get(async (req, res) =>
    {
        let users;
        try
        {
            users = await userData.getUserById(req.params.userId);
        } catch(error)
        {
            res.status(400).json(error);
        }

        const connections = users.connections;
        const connectionsList = [];

        for(let ele of connections)
        {
            let follower;
            try
            {
                follower = await userData.getUserById(ele);
            } catch(error)
            {
                res.status(400).json(error);
            }
            connectionsList.push(follower);
        }

        res.render('networks/networkFollower', { title: "Follower Profile", h1: "Follower Profile", userId: req.params.userId, connectionsList: connectionsList });
    })
    .delete(async (req, res) =>
    {
        let userId = req.params.userId;
        let followerId = req.body.followerId

        try
        {
            userId = validation.checkId(userId, 'User ID');
        } catch(e)
        {
            return res.status(400).json({ error: e });
        }

        try
        {
            followerId = validation.checkId(followerId, 'Follower ID');
        } catch(e)
        {
            return res.status(400).json({ error: e });
        }

        try
        {
            let removeConnections = await networkData.removeConnections(userId, followerId);
            return res.redirect(`/network/follower/${userId}`);
        } catch(e)
        {
            let status = e[0];
            let message = e[1];
            res.status(status).json({ error: message });
        }
    }
    )


router.route('/follower/:userId/create')
    .get(async (req, res) =>
    {
        let connectionList;
        let userConnections;
        const userId = req.params.userId
        try
        {
            connectionList = await userData.getAllUser();
        } catch(error)
        {
            res.status(400).json(error);
        }
        try
        {
            userConnections = (await userData.getUserById(userId)).connections;
        } catch(error)
        {
            res.status(400).json(error);
        }
        connectionList = connectionList.filter((ele) => { return ele._id !== userId }); //remove userid in all user data
        connectionList = connectionList.filter((ele1) =>                     //remove userid's connection in all user data
        {
            return !userConnections.includes(ele1._id)
        }) // issue
        const checker = [null, undefined, 0]; //filtering conditions
        connectionList = connectionList.filter((item) => !checker.includes(item))
        res.render("networks/followerCreate", { h1: "Connections", title: "Connections", userId: userId, connectionList: connectionList })
    })
    .post(async (req, res) =>
    {
        let followerId = req.body.followerId
        let userId = req.params.userId;

        try
        {
            userId = validation.checkId(userId, 'ID url param');
        } catch(e)
        {
            return res.status(404).json(e)
        }

        try
        {
            followerId = validation.checkId(followerId, 'ID url param');
        } catch(e)
        {
            return res.status(404).json(e)
        }

        let addConnectionsInfo;
        try
        {
            addConnectionsInfo = await networkData.addConnections(userId, followerId)
        } catch(error)
        {
            return res.status(404).json(e)
        }
        res.redirect(`/network/follower/${userId}`);
    })

export default router;