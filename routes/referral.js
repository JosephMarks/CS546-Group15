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
    return res.status(404).render("referral/error", {
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

    const title = "Referral Page";
    const h1 = "Referral Page";
    let userPostedPostList, userLikedPostList;

    try {
      userPostedPostList = await referralData.getPostedPostByUserId(
        req.params.userid
      );
    } catch (error) {
      return res.status(404).render("referral/error", {
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
      return res.status(404).render("referral/error", {
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
      return res.status(404).render("referral/error", {
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
    let s = await userData.getUserById(req.session.user.userId);
    try {
      if (!s.companyName)
        throw "You should fill in your company name in your profile first, then refer a job to that company!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let arrofcom = await companyData.getAllCompanyName();
    try {
      if (!arrofcom.includes(s.companyName))
        throw "You should update your company name in your profile first or create your company in system, then refer a job to that company!";
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
    let s = await userData.getUserById(req.session.user.userId);
    try {
      if (!s.companyName)
        throw "You should fill in your company name in your profile first, then refer a job to that company!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let arrofcom = await companyData.getAllCompanyName();
    try {
      if (!arrofcom.includes(s.companyName))
        throw "You should update your company name in your profile first, then refer a job to that company!";
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
    let skills = [];
    let jobType = [];
    let location = [];
    let companyList = await companyData.getAllCompanyNameinObject();
    try {
      if (
        !(
          req.body.field &&
          req.body.skills &&
          req.body.jobType &&
          req.body.location
        )
      )
        throw "Please select fields, skills, jobType and location tags!";
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      if (typeof req.body.field === "string") {
        field.push(req.body.field);
      } else {
        field = req.body.field;
      }
      field = field.map((x) => xss(x));
      if (typeof req.body.skills === "string") {
        skills.push(req.body.skills);
      } else {
        skills = req.body.skills;
      }
      skills = skills.map((x) => xss(x));
      if (typeof req.body.jobType === "string") {
        jobType.push(req.body.jobType);
      } else {
        jobType = req.body.jobType;
      }
      jobType = jobType.map((x) => xss(x));
      if (typeof req.body.location === "string") {
        location.push(req.body.location);
      } else {
        location = req.body.location;
      }
      location = location.map((x) => xss(x));
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    companyEmail = companyEmail.trim();
    jobTitle = jobTitle.trim();
    description = description.trim();
    try {
      jobTitle = validation.validateNameAllNumberReturn(jobTitle);
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
        companyEmail,
      });
    }

    let posterId = req.session.user.userId;
    let userId = req.params.userid;
    let company;
    let companys = s.companyName;
    try {
      companys = await validation.checkCompanyTags([companys]);
      company = companys[0];
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }

    try {
      posttitle = validation.validateNameAllNumberReturn(posttitle);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      postbody = validation.checkString(postbody, "Post body");
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      duedate = validation.checkDueDate(duedate);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      companyEmail = validation.checkEmail(companyEmail, "companyEmail");
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      jobTitle = validation.validateNameAllNumberReturn(posttitle);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      salary = salary.trim();
      validation.isSalary(salary);
      salary = Number(salary);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      skills = validation.checkSkillsTags(skills);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      location = validation.checkLocationTags(location);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      level = validation.checkLevelTags([level]);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      jobType = validation.checkJobtypeTags(jobType);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
      });
    }
    try {
      field = validation.checkFieldsTags(field);
    } catch (error) {
      return res.status(400).render("referral/createNewPost", {
        error,
        posttitle,
        postbody,
        userId: req.session.user.userId,
        companyList,
        identity,
        session: req.session.user,
        jobTitle,
        salary,
        description,
        companyEmail,
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
        company,
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
        companyEmail,
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
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      post = await referralData.getPostById(postid);
    } catch (error) {
      return res.status(404).render("referral/error", {
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
      return res.status(404).render("referral/error", {
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
      userId: req.session.user.userId,
      h1: h1,
      auth: auth,
      post: post,
      fname: author.fname,
      lname: author.lname,
      identity: identity,
    });
  })
  .post(async (req, res) => {
    let updatedData = xss(req.body.comments);
    let auth = false;
    let authorid = req.params.userid;
    if (authorid === req.session.user.userId) {
      auth = true;
    }
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      req.params.id = validation.checkId(req.params.id, "ID");
    } catch (e) {
      return res.status(404).render("referral/error", {
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
      return res.status(400).render("referral/yourPostComments", {
        userId: req.session.user.userId,
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
        req.session.user.userId,
        updatedData
      );
      const post = await referralData.getPostById(req.params.id);
      const author = await userData.getUserById(req.params.userid);
    } catch (error) {
      return res.status(500).render("referral/error", {
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
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
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

    try {
      post = await referralData.getPostById(req.params.id);
    } catch (error) {
      return res.status(404).render("referral/error", {
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
      return res.status(404).render("referral/error", {
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
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let s = await userData.getUserById(req.session.user.userId);
    try {
      if (!s.companyName)
        throw "You should fill in your company name in your profile first, then refer a job to that company!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let arrofcom = await companyData.getAllCompanyName();
    try {
      if (!arrofcom.includes(s.companyName))
        throw "You should update your company name in your profile first, then refer a job to that company!";
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

    const title = post.title;
    const h1 = post.title;
    res.render("referral/yourPostEdit", {
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
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      userId = validation.checkId(userId, "User ID");
      postId = validation.checkId(postId, "Post ID");
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

    try {
      const userIdByPostId = await referralData.getPostById(postId);
      if (userIdByPostId.poster.id.toString() !== userId)
        throw "Error: You have no right to modify this post!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let s = await userData.getUserById(req.session.user.userId);
    try {
      if (!s.companyName)
        throw "You should fill in your company name in your profile first, then refer a job to that company!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let arrofcom = await companyData.getAllCompanyName();
    try {
      if (!arrofcom.includes(s.companyName))
        throw "You should update your company name in your profile first, then refer a job to that company!";
    } catch (error) {
      return res.status(403).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
    let title = xss(req.body.posttitle);
    let body = xss(req.body.postbody);
    let duedate = xss(req.body.duedate).toString();
    let companyEmail = xss(req.body.companyEmail);
    let field = [];

    let cs = await userData.getUserById(userId);
    let company = cs.companyName;
    let companyList = await companyData.getAllCompanyNameinObject();
    let post = await referralData.getPostById(req.params.id);
    try {
      if (title) {
        title = validation.validateNameAllNumberReturn(title);
      }

      if (body) {
        body = validation.checkString(body, "Content");
      }

      if (req.body.field) {
        if (typeof req.body.field === "string") {
          field.push(req.body.field);
        } else {
          field = req.body.field;
        }
        field = field.map((x) => xss(x));
      }

      if (duedate) {
        duedate = validation.checkDueDate(duedate);
      }
      if (companyEmail) {
        companyEmail = validation.checkEmail(companyEmail, "companyEmail");
      }
    } catch (error) {
      return res.status(400).render("referral/yourPostEdit", {
        title: title,
        h1: title,
        post: post,
        userId: req.session.user.userId,
        postId: req.params.id,
        companyList: companyList,
      });
    }
    let updatePost = {
      title: title,
      body: body,
      posterId: userId,
      fields: field,
      company: [company],
      duedate: duedate,
      companyEmail: companyEmail,
    };
    try {
      let updated = await referralData.updatePost(postId, updatePost);
    } catch (error) {
      return res.status(500).render("referral/error", {
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
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      req.params.userid = validation.checkId(req.params.userid);
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
      });
    }
    let companyList = await companyData.getAllCompanyNameinObject();
    let userPost = await referralData.getAllPosts();
    return res.render("referral/searchPage", {
      title: "Search Post",
      h1: "Search Post",
      userId: req.session.user.userId,
      userPost: userPost,
      identity: identity,
      companyList: companyList,
    });
  })
  .post(async (req, res) => {
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
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

    let fields = [];

    let company = [];
    try {
      if (req.body.field) {
        if (typeof req.body.field === "string") {
          fields.push(req.body.field);
        } else {
          fields = req.body.field;
        }
        fields = fields.map((x) => xss(x));
      }
      if (req.body.company) {
        if (typeof req.body.company === "string") {
          company.push(req.body.company);
        } else {
          company = req.body.company;
        }
        company = company.map((x) => xss(x));
      }
    } catch (error) {
      let companyList = await companyData.getAllCompanyNameinObject();
      let userPost = await referralData.getAllPosts();
      return res.status(400).render("referral/searchPage", {
        title: "Search Post",
        h1: "Search Post",
        userId: req.session.user.userId,
        userPost: userPost,
        identity: identity,
        companyList: companyList,
        error: error,
      });
    }

    let companyList = await companyData.getAllCompanyNameinObject();
    let a,
      b,
      c = false;
    if (fields.length > 0 && company.length > 0) {
      a = true;
      try {
        let userPost = await referralData.getPostsByAllTag(fields, company);
        return res.render("referral/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          a: a,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          company: company,
          identity: identity,
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
      b = true;
      try {
        let userPost = await referralData.getPostsByFieldsTag(fields);
        return res.render("referral/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          b: b,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          fields: fields,
          identity: identity,
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
      c = true;
      try {
        let userPost = await referralData.getPostsByCompanyTag(company);
        return res.render("referral/searchPage", {
          title: "Search Post",
          h1: "Search Post",
          c: c,
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          company: company,
          identity: identity,
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
          userId: req.session.user.userId,
          userPost: userPost,
          companyList: companyList,
          identity: identity,
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
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
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

    try {
      post = await referralData.getPostById(req.params.id);
    } catch (error) {
      return res.status(404).render("referral/error", {
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
      return res.status(403).render("referral/error", {
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
      identity: identity,
    });
  })
  .delete(async (req, res) => {
    let userId = req.params.userid;
    let postId = req.params.id;
    let author;
    let identity = false;
    if (req.session.user.candidateType === "Company") {
      identity = true;
    }
    try {
      userId = validation.checkId(userId, "User ID");
      postId = validation.checkId(postId, "Post ID");
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
      author = (await referralData.getPostById(postId)).poster.id.toString();
    } catch (error) {
      return res.status(404).render("referral/error", {
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
      return res.status(403).render("referral/error", {
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
      return res.status(500).render("referral/error", {
        title: "error",
        h1: "error",
        userId: req.session.user.userId,
        error: error,
        identity: identity,
      });
    }
  });

export default router;
