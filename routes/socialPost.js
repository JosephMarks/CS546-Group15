import { Router } from "express";
const router = Router();
import { socialPostData, userData, companyData } from "../data/index.js";
import validation from "../helpers.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  try {
    res.redirect(`/socialmediaposts/post/${req.session.user.userId}`);
    // return res.render('socialPost/socialPost', { title: title, h1: h1 });
  } catch (error) {
    return res.status(404).render("socialPost/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
    });
  }
});

router
  .route("/post/:userid")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      return res.status(400).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    const title = "Post";
    const h1 = "Post";
    let userPostedPostList, userLikedPostList;

    try {
      userPostedPostList = await socialPostData.getPostedPostByUserId(
        req.params.userid
      );
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      userLikedPostList = await socialPostData.getLikedPostByUserId(
        req.params.userid
      );
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    let authorId = req.params.userid;
    let userId = req.session.user.userId;

    return res.render("socialPost/UserPost", {
      title: title,
      h1: h1,
      userId: req.session.user.userId,
      userPost: userPostedPostList,
      userLike: userLikedPostList,
      authorId: authorId,
    });
  })
  .post(async (req, res) => {
    let userId = req.session.user.userId;
    let postId = req.body.postid;
    try {
      const post = await socialPostData.getPostById(postId);
      const author = await userData.getUserById(userId);
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    if (await socialPostData.checkLikes(postId, userId)) {
      await socialPostData.addLikes(postId, userId);
    } else {
      await socialPostData.removeLikes(postId, userId);
    }
    return res.redirect(`/socialmediaposts/post/${req.params.userid}`);
  });

router
  .route("/post/:userid/new")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      return res.status(400).render("socialPost/error", {
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
      return res.status(400).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();

    return res.render("socialPost/createNewPost", {
      title: "New Post",
      h1: "New Post",
      userId: req.session.user.userId,
      companyList: companyList,
    });
  })
  .post(async (req, res) => {
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    let posttitle = xss(req.body.posttitle);
    let postbody = xss(req.body.postbody);
    let eventdate = xss(req.body.eventdate).toString();
    let field;
    let category;
    let company;
    let companyList = await companyData.getAllCompanyNameinObject();
    try {
      if (!(req.body.field && req.body.category && req.body.company))
        throw "Please select fields, category and company tags!";
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }
    if (typeof req.body.field === "string") {
      field = [req.body.field];
    } else {
      field = req.body.field;
    }
    field = field.map((x) => xss(x));

    if (typeof req.body.category === "string") {
      category = [req.body.category];
    } else {
      category = req.body.category;
    }
    category = category.map((x) => xss(x));

    if (typeof req.body.company === "string") {
      company = [req.body.company];
    } else {
      company = req.body.company;
    }
    company = company.map((x) => xss(x));

    let posterId = req.session.user.userId;
    let userId = req.params.userid;

    try {
      posttitle = validation.checkString(posttitle, "Post title");
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }
    try {
      field = validation.checkFieldsTags(field);
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }
    try {
      postbody = validation.checkString(postbody, "Post body");
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }
    try {
      eventdate = validation.checkDate(eventdate);
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }

    try {
      category = validation.checkCategoryTags(category);
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }
    try {
      company = await validation.checkCompanyTags(company);
    } catch (error) {
      return res.status(400).render("socialPost/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
      });
    }
    let newPost;
    try {
      newPost = await socialPostData.addPost(
        posttitle,
        postbody,
        posterId,
        eventdate,
        field,
        company,
        category
      );
      res.redirect(`/socialmediaposts/post/${req.params.userid}`);
    } catch (error) {
      return res.status(500).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
  });

router
  .route("/post/:userid/postId/:id")
  .get(async (req, res) => {
    let post, postid, author, authorid;
    postid = req.params.id;
    authorid = req.params.userid;
    let auth = false;
    if (authorid === req.session.user.userId) {
      auth = true;
    }

    try {
      post = await socialPostData.getPostById(postid);
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      author = await userData.getUserById(authorid);
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    const title = post.title;
    const h1 = post.title;
    res.render("socialPost/yourPostComments", {
      title: title,
      userId: req.session.user.userId,
      h1: h1,
      auth: auth,
      post: post,
      fname: author.fname,
      lname: author.lname,
    });
  })
  .post(async (req, res) => {
    let updatedData = xss(req.body.comments);
    let auth = false;
    let authorid = req.params.userid;
    if (authorid === req.session.user.userId) {
      auth = true;
    }
    try {
      req.params.id = validation.checkId(req.params.id, "ID");
    } catch (e) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      updatedData = validation.checkString(updatedData, "Comment");
    } catch (error) {
      const post = await socialPostData.getPostById(req.params.id);
      const author = await userData.getUserById(post.userId);
      const title = post.title;
      const h1 = post.title;
      return res.status(400).render("socialPost/yourPostComments", {
        title: title,
        h1: h1,
        post: post,
        userId: req.session.user.userId,
        auth: auth,
        fname: author.fname,
        lname: author.lname,
        error: error,
        newComments: updatedData,
      });
    }

    try {
      const updatedPost = await socialPostData.addComments(
        req.params.id,
        req.session.user.userId,
        updatedData
      );
      const post = await socialPostData.getPostById(req.params.id);
      const author = await userData.getUserById(req.params.userid);
    } catch (error) {
      return res.status(500).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(
      `/socialmediaposts/post/${req.params.userid}/postId/${req.params.id}`
    );
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
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      post = await socialPostData.getPostById(req.params.id);
    } catch (error) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    let o = post.poster.id.toString();
    try {
      author = await userData.getUserById(o);
    } catch (error) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      if (
        author._id !== req.params.userid ||
        author._id !== req.session.user.userId ||
        req.session.user.userId !== req.params.userid
      )
        throw `You have no right to modify this post!`;
    } catch (error) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();

    const title = post.title;
    const h1 = post.title;
    res.render("socialPost/yourPostEdit", {
      title: title,
      h1: h1,
      post: post,
      userId: req.session.user.userId,
      postId: req.params.id,
      companyList: companyList,
    });
  })
  .patch(async (req, res) => {
    let userId = req.params.userid;
    let postId = req.params.id;

    try {
      userId = validation.checkId(userId, "User ID");
      postId = validation.checkId(postId, "Post ID");
    } catch (error) {
      return res.status(403).render("socialPost/error", {
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
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      const userIdByPostId = await socialPostData.getPostById(postId);
      if (userIdByPostId.poster.id.toString() !== userId)
        throw "Error: You have no right to modify this post!";
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    let title = xss(req.body.posttitle);
    let body = xss(req.body.postbody);
    let eventdate = xss(req.body.eventdate).toString();
    let fields;
    let category;
    let company;

    try {
      if (title) {
        title = validation.checkString(title, "title");
      }
      if (body) {
        body = validation.checkString(body, "Content");
      }

      if (req.body.field) {
        if (typeof req.body.field === "string") {
          fields = [req.body.field];
        } else {
          fields = req.body.field;
        }
        fields = fields.map((x) => xss(x));
      }
      if (req.body.company) {
        if (typeof req.body.company === "string") {
          company = [req.body.company];
        } else {
          company = req.body.company;
        }
        company = company.map((x) => xss(x));
      }
      if (req.body.category) {
        if (typeof req.body.category === "string") {
          category = [req.body.category];
        } else {
          category = req.body.category;
        }
        category = category.map((x) => xss(x));
      }

      if (eventdate) {
        eventdate = validation.checkDate(eventdate);
      }
    } catch (error) {
      let companyList = await companyData.getAllCompanyNameinObject();
      let post = await socialPostData.getPostById(req.params.id);
      return res.status(400).render("socialPost/yourPostEdit", {
        title: title,
        h1: h1,
        post: post,
        error: error,
        userId: req.session.user.userId,
        postId: req.params.id,
        companyList: companyList,
      });
    }
    let updatePost = {
      title: title,
      body: body,
      posterId: userId,
      fields: fields,
      category: category,
      company: company,
      eventdate: eventdate,
    };
    try {
      let updated = await socialPostData.updatePost(postId, updatePost);
    } catch (error) {
      return res.status(500).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    res.redirect(`/socialmediaposts/post/${userId}/postId/${postId}`);
  });
router
  .route("/search/:userid")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      return res.status(403).render("socialPost/error", {
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
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();
    let userPost = await socialPostData.getAllPosts();
    return res.render("socialPost/searchPage", {
      title: "Search Post",
      h1: "Search Post",
      userId: req.session.user.userId,
      userPost: userPost,
      companyList: companyList,
    });
  })
  .post(async (req, res) => {
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    let fields;
    let category;
    let company;
    if (req.body.field) {
      if (typeof req.body.field === "string") {
        fields = [req.body.field];
      } else {
        fields = req.body.field;
      }
      fields = fields.map((x) => xss(x));
    }
    if (req.body.company) {
      if (typeof req.body.company === "string") {
        company = [req.body.company];
      } else {
        company = req.body.company;
      }
      company = company.map((x) => xss(x));
    }
    if (req.body.category) {
      if (typeof req.body.category === "string") {
        category = [req.body.category];
      } else {
        category = req.body.category;
      }
      category = category.map((x) => xss(x));
    }
    let companyList = await companyData.getAllCompanyNameinObject();
    let a,
      b,
      c,
      d,
      e,
      f,
      g = false;
    if (fields && category && company) {
      a = true;
      try {
        let userPost = await socialPostData.getPostsByAllTag(
          fields,
          company,
          category
        );
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          a: a,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else if (fields && category) {
      b = true;
      try {
        let userPost = await socialPostData.getPostsByFieldsCategoryTag(
          fields,
          category
        );
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          b: b,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else if (fields && company) {
      c = true;
      try {
        let userPost = await socialPostData.getPostsByFieldsCompanyTag(
          fields,
          company
        );
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          c: c,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else if (category && company) {
      d = true;
      try {
        let userPost = await socialPostData.getPostsByCompanyCategoryTag(
          company,
          category
        );
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          d: d,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else if (category) {
      e = true;
      try {
        let userPost = await socialPostData.getPostsByCategoryTag(category);
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          e: e,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else if (company) {
      f = true;
      try {
        let userPost = await socialPostData.getPostsByCompanyTag(company);
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          f: f,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else if (fields) {
      g = true;
      try {
        let userPost = await socialPostData.getPostsByFieldsTag(fields);
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          g: g,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    } else {
      try {
        let userPost = await socialPostData.getAllPosts();
        return res.render("socialPost/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          g: g,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          category: category,
        });
      } catch (error) {
        return res.status(400).render("socialPost/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
        });
      }
    }
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
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      post = await socialPostData.getPostById(req.params.id);
    } catch (error) {
      return res.status(404).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    author = post.poster.id.toString();

    try {
      if (
        author !== req.params.userid ||
        author !== req.session.user.userId ||
        req.session.user.userId !== req.params.userid
      )
        throw `Error: You have not right to access.`;
    } catch (error) {
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
    const title = post.title;
    const h1 = post.title;
    return res.render("socialPost/yourPostRemove", {
      title: title,
      h1: h1,
      post: post,
      userId: req.session.user.userId,
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
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      author = (await socialPostData.getPostById(postId)).poster.id.toString();
    } catch (error) {
      return res.status(403).render("socialPost/error", {
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
      return res.status(403).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }

    try {
      await socialPostData.removePost(postId, userId);
      res.redirect(`/socialmediaposts/post/${userId}`);
    } catch (error) {
      return res.status(500).render("socialPost/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
      });
    }
  });

export default router;
