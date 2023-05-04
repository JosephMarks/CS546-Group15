import { Router } from "express";
const router = Router();
import { referralData, userData } from "../data/index.js";
import validation from "../helpers.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  try {
    res.redirect(`/network/post/${req.session.user.userId}`);
    // return res.render('networks/network', { title: title, h1: h1 });
  } catch (error) {
    return res.status(400).render("networks/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
    });
  }
});

router.route("/post/:userid").get(async (req, res) => {
  try {
    req.params.userid = validation.checkId(req.params.userid);
  } catch (error) {
    return res.status(400).render("networks/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
    });
  }

  try {
    validation.checkParamsAndSessionId(
      req.params.userid,
      req.session.user.userId
    );
  } catch (error) {
    return res.status(400).render("networks/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
    });
  }

  const title = "Post";
  const h1 = "Post";
  let userPostList, followerPostList;

  try {
    userPostList = await networkData.getPostByUserId(req.params.userid);
  } catch (error) {
    return res.status(400).render("networks/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
    });
  }

  try {
    followerPostList = await networkData.getPostByConnections(
      req.params.userid
    );
  } catch (error) {
    return res.status(400).render("networks/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
    });
  }
  return res.render("networks/networkPost", {
    title: title,
    h1: h1,
    authorId: req.params.userid,
    userId: req.params.userid,
    userPost: userPostList,
    followerPost: followerPostList,
  });
});

router
  .route("/post/:userid/new")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    return res.render("networks/createNewPost", {
      title: "New Post",
      h1: "New Post",
      userId: req.session.user.userId,
    });
  })
  .post(async (req, res) => {
    let post = xss(req.body.post);
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(500).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      post = validation.checkString(post, "Post");
    } catch (error) {
      return res.render("networks/createNewPost", {
        error: error,
        post: post,
        userId: req.params.userid,
      });
    }

    let newPost;
    try {
      newPost = await networkData.addPost(req.params.userid, post);
    } catch (error) {
      return res.status(500).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(`/network/post/${req.params.userid}`);
  });

router
  .route("/post/:userid/postId/:id")
  .get(async (req, res) => {
    let post, author;
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      post = await networkData.getPostById(req.params.id);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      author = await userData.getUserById(post.userId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    const title = post.content;
    const h1 = post.content;
    res.render("networks/yourPostComments", {
      title: title,
      userId: req.params.userid,
      h1: h1,
      post: post,
      fname: author.fname,
      lname: author.lname,
    });
  })
  .post(async (req, res) => {
    let updatedData = xss(req.body.comments);
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      req.params.id = validation.checkId(req.params.id, "ID");
    } catch (e) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      updatedData = validation.checkString(updatedData, "Comment");
    } catch (error) {
      const post = await networkData.getPostById(req.params.id);
      const author = await userData.getUserById(post.userId);
      const title = post.content;
      const h1 = post.content;
      return res.render("networks/yourPostComments", {
        title: title,
        h1: h1,
        post: post,
        fname: author.fname,
        lname: author.lname,
        error: error,
        newComments: updatedData,
      });
    }

    try {
      const updatedPost = await networkData.addComments(
        req.params.id,
        req.params.userid,
        updatedData
      );
      const post = await networkData.getPostById(req.params.id);
      const author = await userData.getUserById(req.params.userid);
      const title = post.content;
      const h1 = post.content;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(`/network/post/${req.params.userid}`);
  });

router
  .route("/post/:userid/postId/:id/edit")
  .get(async (req, res) => {
    let post, author;
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      post = await networkData.getPostById(req.params.id);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      author = await userData.getUserById(post.userId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      if (author._id !== req.params.userid)
        throw `You have no right to modify this post!`;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    const title = post.content;
    const h1 = post.content;
    res.render("networks/yourPostEdit", {
      title: title,
      h1: h1,
      post: post,
      userId: req.params.userid,
    });
  })
  .patch(async (req, res) => {
    let userId = req.params.userid;
    let postId = req.params.id;
    let content = req.body.content;

    try {
      userId = validation.checkId(userId, "User ID");
      postId = validation.checkId(postId, "Post ID");
      if (content) content = validation.checkString(content, "Post");
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      const userIdByPostId = await networkData.getPostById(postId);
      if (userIdByPostId.userId !== userId)
        throw "Error: You have no right to modify this post!";
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      await networkData.updatePost(postId, content);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(`/network/post/${userId}`);
  });

router
  .route("/post/:userid/postId/:id/remove")
  .get(async (req, res) => {
    let post, author;
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      post = await networkData.getPostById(req.params.id);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    author = post.userId;

    try {
      if (
        author !== req.params.userid ||
        author !== req.session.user.userId ||
        req.session.user.userId !== req.params.userid
      )
        throw `Error: You have not right to access.`;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    const title = post.content;
    const h1 = post.content;
    return res.render("networks/yourPostRemove", {
      title: title,
      h1: h1,
      post: post,
      userId: req.params.userid,
    });
  })
  .delete(async (req, res) => {
    let userId = req.params.userid;
    let postId = req.params.id;
    let author;
    try {
      userId = validation.checkId(userId, "User ID");
      postId = validation.checkId(postId, "Post ID");
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      author = (await networkData.getPostById(postId)).userId;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      if (
        author !== userId ||
        author !== req.session.user.userId ||
        req.session.user.userId !== userId
      )
        throw `Error: You have not right to access.`;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      await networkData.removePost(postId);
      return res.redirect(`/network/post/${userId}`);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
  });

router
  .route("/post/:userId/followerId/:followerId/postId/:postId")
  .get(async (req, res) => {
    let post, author, user;
    let followerId = req.params.followerId;
    try {
      followerId = validation.checkId(followerId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    try {
      post = await networkData.getPostById(req.params.postId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      author = await userData.getUserById(req.params.followerId);
      if (post.userId !== followerId)
        throw `Error: You have no right to access.`;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      user = await userData.getUserById(req.params.userId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      if (!user.connections.includes(followerId))
        throw `Error: Follower is not in the user's connections`;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      validation.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      if (post.userId !== author._id) throw `Error: Can not found this page.`;
    } catch (error) {
      return res.status(404).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    const title = post.content;
    const h1 = post.content;
    res.render("networks/followerPostComments", {
      title: title,
      h1: h1,
      post: post,
      userId: req.params.userId,
      followerId: req.params.followerId,
      author: author,
    });
  })
  .post(async (req, res) => {
    let updatedData = xss(req.body.comments);
    let errors = [];
    let post, author;
    try {
      updatedData = validation.checkString(updatedData, "Comments");
    } catch (error) {
      errors.push(error);
    }

    try {
      post = await networkData.getPostById(req.params.postId);
    } catch (e) {
      errors.push(e);
    }

    try {
      author = await userData.getUserById(req.params.followerId);
    } catch (error) {
      return res.status(404).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      if (req.params.followerId !== post.userId)
        throw `Error: You have no right to access.`;
    } catch (e) {
      return res.status(404).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    if (errors.length > 0) {
      const title = post.content;
      const h1 = post.content;
      res.render("networks/followerPostComments", {
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

    try {
      await networkData.addComments(
        req.params.postId,
        req.params.userId,
        updatedData
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(`/network/post/${req.params.userId}`);
  });

router
  .route("/follower/:userId")
  .get(async (req, res) => {
    let users;
    try {
      users = await userData.getUserById(req.params.userId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      validation.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    const connections = users.connections;
    const connectionsList = [];

    for (let ele of connections) {
      let follower;
      try {
        follower = await userData.getUserById(ele);
      } catch (error) {
        return res.status(400).render("networks/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
      connectionsList.push(follower);
    }

    res.render("networks/networkFollower", {
      title: "Follower Profile",
      h1: "Follower Profile",
      userId: req.params.userId,
      connectionsList: connectionsList,
    });
  })
  .delete(async (req, res) => {
    let userId = req.params.userId;
    let followerId = req.body.followerId;

    try {
      validation.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      userId = validation.checkId(userId, "User ID");
    } catch (e) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      followerId = validation.checkId(followerId, "Follower ID");
    } catch (e) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      let removeConnections = await networkData.removeConnections(
        userId,
        followerId
      );
    } catch (e) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    return res.redirect(`/network/follower/${userId}`);
  });

router
  .route("/follower/:userId/create")
  .get(async (req, res) => {
    let connectionList;
    let userConnections;
    const userId = req.params.userId;

    try {
      validation.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      connectionList = await userData.getAllUser();
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    try {
      userConnections = (await userData.getUserById(userId)).connections;
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    connectionList = connectionList.filter((ele) => {
      return ele._id !== userId;
    }); //remove userid in all user data
    connectionList = connectionList.filter(
      (
        ele1 //remove userid's connection in all user data
      ) => {
        return !userConnections.includes(ele1._id);
      }
    ); // issue
    const checker = [null, undefined, 0]; //filtering conditions
    connectionList = connectionList.filter((item) => !checker.includes(item));
    res.render("networks/followerCreate", {
      h1: "Connections",
      title: "Connections",
      userId: userId,
      connectionList: connectionList,
    });
  })
  .post(async (req, res) => {
    let followerId = req.body.followerId;
    let userId = req.params.userId;
    try {
      validation.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      userId = validation.checkId(userId, "ID url param");
    } catch (e) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      followerId = validation.checkId(followerId, "ID url param");
    } catch (e) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    let addConnectionsInfo;
    try {
      addConnectionsInfo = await networkData.addConnections(userId, followerId);
    } catch (error) {
      return res.status(400).render("networks/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(`/network/follower/${userId}`);
  });

export default router;