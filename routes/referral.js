import { Router } from "express";
const router = Router();
import { referralData, userData, companyData } from "../data/index.js";
import validation from "../helpers.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  try {
    res.redirect(`/referral/post/${req.session.user.userId}`);
    // return res.render('referral/referral', { title: title, h1: h1 });
  } catch (error) {
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    return res.status(400).render("referral/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
      identity: identity,
    });
  }
});

router
  .route("/post/:userid")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    const title = "Post";
    const h1 = "Post";
    let userPostedPostList, userLikedPostList;

    try {
      userPostedPostList = await referralData.getPostedPostByUserId(
        req.params.userid
      );
    } catch (error) {
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      userLikedPostList = await referralData.getLikedPostByUserId(
        req.params.userid
      );
    } catch (error) {
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    let authorId = req.params.userid;
    let userId = req.session.user.userId;

    return res.render("referral/UserPost", {
      title: title,
      h1: h1,
      userId: userId,
      userPost: userPostedPostList,
      userLike: userLikedPostList,
      authorId: authorId,
      identity: identity,
    });
  })
  .post(async (req, res) => {
    let userId = req.session.user.userId;
    let postId = req.body.postid;
    try {
      const post = await referralData.getPostById(postId);
      const author = await userData.getUserById(userId);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    if (await referralData.checkLikes(postId, userId)) {
      await referralData.addLikes(postId, userId);
    } else {
      await referralData.removeLikes(postId, userId);
    }
    return res.redirect(`/referral/post/${req.params.userid}`);
  });

router
  .route("/post/:userid/new")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      if (req.session.user.candidateType !== "Company")
        throw "You have no access to refer a job!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();

    return res.render("referral/createNewPost", {
      title: "New Post",
      h1: "New Post",
      userId: req.session.user.userId,
      companyList: companyList,
      identity: identity,
      session: req.session.user,
    });
  })
  .post(async (req, res) => {
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      if (req.session.user.candidateType !== "Company")
        throw "You have no access to refer a job!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let posttitle = xss(req.body.posttitle);
    let postbody = xss(req.body.postbody);
    let duedate = xss(req.body.duedate).toString();
    let companyEmail = xss(req.body.companyEmail);
    let jobTitle = xss(req.body.jobTitle);
    let salary = xss(req.body.salary);
    let level = xss(req.body.level); //
    let description = xss(req.body.description);
    let field = [];
    if (xss(req.body.field).includes(",")) {
      field = xss(req.body.field).split(",");
    } else {
      field.push(xss(req.body.field));
    }
    let skills = [];
    if (xss(req.body.skills).includes(",")) {
      skills = xss(req.body.skills).split(",");
    } else {
      skills.push(xss(req.body.skills));
    }
    let jobType = [];
    if (xss(jobType).includes(",")) {
      jobType = xss(req.body.jobType).split(",");
    } else {
      jobType.push(xss(req.body.jobType));
    }
    let location = [];
    if (xss(location).includes(",")) {
      location = xss(req.body.location).split(",");
    } else {
      location.push(xss(req.body.location));
    }
    let company = [];
    try {
      if (xss(req.body.company).includes(","))
        throw "Please select one company for the job!";
    } catch (error) {
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    company.push(xss(req.body.company));

    let posterId = req.session.user.userId;
    let userId = req.params.userid;
    let companyList = await companyData.getAllCompanyNameinObject();
    try {
      posttitle = validation.checkString(posttitle, "Post title");
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      postbody = validation.checkString(postbody, "Post body");
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      duedate = validation.checkDueDate(duedate);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      companyEmail = validation.checkEmail(companyEmail, "companyEmail");
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      jobTitle = validation.checkString(posttitle, "Post title");
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      validation.isSalary(salary);
      salary = Number(salary);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      skills = validation.checkSkillsTags(skills);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      location = validation.checkLocationTags(location);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      level = validation.checkLevelTags([level]);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      jobType = validation.checkJobtypeTags(jobType);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    try {
      field = validation.checkFieldsTags(field);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }

    try {
      company = await validation.checkCompanyTags(company);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId,
        companyList,
        session: req.session.user,
        jobTitle,
        salary,
        description,
      });
    }
    let newPost;
    try {
      newPost = await referralData.addPost(
        posttitle,
        postbody,
        posterId,
        duedate,
        field,
        company[0],
        companyEmail,
        jobTitle,
        salary,
        level,
        jobType,
        skills,
        location,
        description
      );
      res.redirect(`/referral/post/${req.params.userid}`);
    } catch (error) {
      return res.status(500).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
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
      post = await referralData.getPostById(postid);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      author = await userData.getUserById(authorid);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    const title = post.title;
    const h1 = post.title;
    res.render("referral/yourPostComments", {
      title: title,
      userId: req.params.userid,
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      updatedData = validation.checkString(updatedData, "Comment");
    } catch (error) {
      const post = await referralData.getPostById(req.params.id);
      const author = await userData.getUserById(post.userId);
      const title = post.title;
      const h1 = post.title;
      return res.render("referral/yourPostComments", {
        title: title,
        h1: h1,
        post: post,
        auth: auth,
        fname: author.fname,
        lname: author.lname,
        error: error,
        identity: identity,
        newComments: updatedData,
      });
    }

    try {
      const updatedPost = await referralData.addComments(
        req.params.id,
        req.params.userid,
        updatedData
      );
      const post = await referralData.getPostById(req.params.id);
      const author = await userData.getUserById(req.params.userid);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    res.redirect(`/referral/post/${req.params.userid}/postId/${req.params.id}`);
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      post = await referralData.getPostById(req.params.id);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let o = post.poster.id.toString();
    try {
      author = await userData.getUserById(o);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();

    const title = post.title;
    const h1 = post.title;
    res.render("referral/yourPostEdit", {
      title: title,
      h1: h1,
      post: post,
      userId: req.params.userid,
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      const userIdByPostId = await referralData.getPostById(postId);
      if (userIdByPostId.poster.id.toString() !== userId)
        throw "Error: You have no right to modify this post!";
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let title = xss(req.body.posttitle);
    let body = xss(req.body.postbody);
    let eventdate = xss(req.body.eventdate).toString();

    let fields = xss(req.body.field);
    let category = xss(req.body.category);
    let company = xss(req.body.company);
    if (title) {
      title = validation.checkString(title, "title");
    }
    if (body) {
      body = validation.checkString(body, "Content");
    }
    let field = [];
    if (fields) {
      if (xss(req.body.field).includes(",")) {
        field = xss(req.body.field).split(",");
      } else {
        field.push(xss(req.body.field));
      }
      fields = field;
    }
    let categorys = [];
    if (category) {
      if (xss(req.body.category).includes(",")) {
        categorys = xss(req.body.category).split(",");
      } else {
        categorys.push(xss(req.body.category));
      }
      category = categorys;
    }
    let companys = [];
    if (company) {
      if (xss(req.body.company).includes(",")) {
        companys = xss(req.body.company).split(",");
      } else {
        companys.push(xss(req.body.company));
      }
      company = companys;
    }

    if (eventdate) {
      eventdate = validation.checkDate(eventdate);
    }
    try {
    } catch (error) {}
    let updatePost = {
      title: title,
      body: body,
      poster: { id: userId },
      fields: fields,
      category: category,
      company: company,
      eventdate: eventdate,
    };
    try {
      let updated = await referralData.updatePost(postId, updatePost);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    res.redirect(`/referral/post/${userId}/postId/${postId}`);
  });
router
  .route("/search/:userid")
  .get(async (req, res) => {
    try {
      req.params.userid = validation.checkId(req.params.userid);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      validation.checkParamsAndSessionId(
        req.params.userid,
        req.session.user.userId
      );
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();
    let userPost = await referralData.getAllPosts();
    return res.render("referral/searchPage", {
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
      return res.status(500).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    let fields = xss(req.body.field);
    let category = xss(req.body.category);
    let company = xss(req.body.company);

    let field = [];
    if (fields) {
      if (xss(req.body.field).includes(",")) {
        field = xss(req.body.field).split(",");
      } else {
        field.push(xss(req.body.field));
      }
      fields = field;
    }
    let categorys = [];
    if (category) {
      if (xss(req.body.category).includes(",")) {
        categorys = xss(req.body.category).split(",");
      } else {
        categorys.push(xss(req.body.category));
      }
      category = categorys;
    }
    let companys = [];
    if (company) {
      if (xss(req.body.company).includes(",")) {
        companys = xss(req.body.company).split(",");
      } else {
        companys.push(xss(req.body.company));
      }
      company = companys;
    }
    let companyList = await companyData.getAllCompanyNameinObject();
    let a,
      b,
      c,
      d,
      e,
      f,
      g = false;
    if (fields.length > 0 && category.length > 0 && company.length > 0) {
      a = true;
      try {
        let userPost = await referralData.getPostsByAllTag(
          fields,
          company,
          category
        );
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else if (fields.length > 0 && category.length > 0) {
      b = true;
      try {
        let userPost = await referralData.getPostsByFieldsCategoryTag(
          fields,
          category
        );
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else if (fields.length > 0 && company.length > 0) {
      c = true;
      try {
        let userPost = await referralData.getPostsByFieldsCompanyTag(
          fields,
          company
        );
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else if (category.length > 0 && company.length > 0) {
      d = true;
      try {
        let userPost = await referralData.getPostsByCompanyCategoryTag(
          company,
          category
        );
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else if (category.length > 0) {
      e = true;
      try {
        let userPost = await referralData.getPostsByCategoryTag(category);
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else if (company.length > 0) {
      f = true;
      try {
        let userPost = await referralData.getPostsByCompanyTag(company);
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else if (fields.length > 0) {
      g = true;
      try {
        let userPost = await referralData.getPostsByFieldsTag(fields);
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
        });
      }
    } else {
      try {
        let userPost = await referralData.getAllPosts();
        return res.render("referral/searchPage", {
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
        return res.status(500).render("referral/error", {
          title: "error",
          h1: "error",
          userId: req.session.user.userId,
          error: error,
          identity: identity,
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      post = await referralData.getPostById(req.params.id);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    const title = post.title;
    const h1 = post.title;
    return res.render("referral/yourPostRemove", {
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      author = (await referralData.getPostById(postId)).poster.id.toString();
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
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
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }

    try {
      await referralData.removePost(postId, userId);
      res.redirect(`/referral/post/${userId}`);
    } catch (error) {
      let identity = false;
      if (req.session.user.candidateType === "Company") {
        identity = true;
      }
      return res.status(400).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
  });

export default router;
