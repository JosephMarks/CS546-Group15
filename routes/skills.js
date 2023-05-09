import { Router } from "express";
import skillsData from "../data/skills.js";
import validations from "../helpers.js";
import axios from "axios";
import xss from "xss";

const router = Router();

router.route("/").get(async (req, res) => {
  let skills = await skillsData.getAllSkills();
  skills.map((ele) => {
    ele.tags = ele.tags.split(",");
  });

  const request = {
    method: "GET",
    url: "https://motivational-quotes-quotable-api.p.rapidapi.com/motivational_quotes",
    headers: {
      "X-RapidAPI-Key": "7fe356965emsha4a36952851d8cdp17f29bjsn1cff5cbe731a",
      "X-RapidAPI-Host": "motivational-quotes-quotable-api.p.rapidapi.com",
    },
  };

  let quotes;
  try {
    quotes = (await axios.request(request)).data;
  } catch (error) {
    return res.status(404).render("skills/error", {
      title: "error",
      h1: "error",
      userId: req.session.user.userId,
      error: error,
      img: "https://http.dog/404.jpg",
    });
  }

  res.render("skills/skillsHome", {
    title: "Skills Home",
    h1: "Skills Home",
    Id: req.session.user.userId,
    skills: skills,
    quotes: quotes,
  });
});

router
  .route("/create/:userId")
  .get(async (req, res) => {
    try {
      validations.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(401).render("skills/error", {
        title: "Error",
        h1: "Error",
        userId: req.session.user.userId,
        error: error,
        img: "https://http.dog/401.jpg",
      });
    }
    res.render("skills/skillsNewPost", {
      title: "New Post",
      h1: "New Post",
      Id: req.params.userId,
    });
  })
  .post(async (req, res) => {
    const body = req.body;
    let { postTitle, article, interest, url } = body;
    postTitle = xss(postTitle);
    article = xss(article);
    interest = xss(interest);
    url = xss(url);
    let userId = req.session.user.userId;
    try {
      validations.checkParamsAndSessionId(
        req.params.userId,
        req.session.user.userId
      );
    } catch (error) {
      return res.status(401).render("skills/error", {
        title: "Error",
        h1: "Error",
        userId: req.session.user.userId,
        error: error,
        img: "https://http.dog/401.jpg",
      });
    }

    try {
      userId = validations.checkId(userId);
    } catch (error) {
      return res.status(400).render("skills/skillsNewPost", {
        title: "New Post",
        h1: "New Post",
        Id: req.session.user.userId,
        postTitle: postTitle,
        article: article,
        interest: interest,
        videoUrl: url,
        error: error,
      });
    }

    try {
      postTitle = validations.checkString(postTitle, "Title");
    } catch (error) {
      return res.status(400).render("skills/skillsNewPost", {
        title: "New Post",
        h1: "New Post",
        Id: req.session.user.userId,
        postTitle: postTitle,
        article: article,
        interest: interest,
        videoUrl: url,
        error: error,
      });
    }

    try {
      article = validations.checkString(article, "Article");
    } catch (error) {
      return res.status(400).render("skills/skillsNewPost", {
        title: "New Post",
        h1: "New Post",
        Id: req.session.user.userId,
        postTitle: postTitle,
        article: article,
        interest: interest,
        videoUrl: url,
        error: error,
      });
    }

    try {
      url = validations.checkVideoUrl(url, "Video link");
    } catch (error) {
      return res.status(400).render("skills/skillsNewPost", {
        title: "New Post",
        h1: "New Post",
        Id: req.session.user.userId,
        postTitle: postTitle,
        article: article,
        interest: interest,
        videoUrl: url,
        error: error,
      });
    }
    try {
      interest = validations.checkTags(interest, "Interest");
    } catch (error) {
      return res.status(400).render("skills/skillsNewPost", {
        title: "New Post",
        h1: "New Post",
        Id: req.session.user.userId,
        postTitle: postTitle,
        article: article,
        interest: interest,
        videoUrl: url,
        error: error,
      });
    }
    try {
      await skillsData.createSkills(userId, postTitle, article, url, interest);
    } catch (error) {
      return res.status(400).render("skills/error", {
        title: "Error",
        h1: "Error",
        userId: req.session.user.userId,
        error: error,
        img: "https://http.dog/400.jpg",
      });
    }
    res.redirect("/skills");
  });

router
  .route("/search/api")
  .get(async (req, res) => {
    res.render("skills/skillsApi", {
      title: "API Search",
      h1: "API Search",
      Id: req.session.user.userId,
    });
  })
  .post(async (req, res) => {
    let errorsList = [];
    let {
      job_title,
      location,
      page,
      date_post,
      employment_types,
      job_requirements,
      remote_jobs_only,
    } = req.body;
    job_title = xss(job_title);
    location = xss(location);
    page = xss(page);
    date_post = xss(date_post);
    employment_types = xss(employment_types);
    job_requirements = xss(job_requirements);
    remote_jobs_only = xss(remote_jobs_only);
    try {
      job_title = validations.checkString(job_title, "Job Title");
    } catch (error) {
      return res.status(400).render("/skills/skillsApi", {
        title: "API Search",
        h1: "API Search",
        job_title: job_title,
        location: location,
        error: error,
      });
    }

    try {
      location = validations.checkString(location, "Location");
    } catch (error) {
      return res.status(400).render("/skills/skillsApi", {
        title: "API Search",
        h1: "API Search",
        job_title: job_title,
        location: location,
        error: error,
      });
    }

    try {
      page = validations.checkPage(page, "Page");
    } catch (error) {
      return res.status(400).render("/skills/skillsApi", {
        title: "API Search",
        h1: "API Search",
        job_title: job_title,
        location: location,
        error: error,
      });
    }

    let query = job_title.concat(" in ", location);
    const params = {
      query: query,
      num_pages: page,
      date_post: date_post,
      employment_types: employment_types,
      job_requirements: job_requirements,
      remote_jobs_only: remote_jobs_only,
    };

    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: params,
      headers: {
        "X-RapidAPI-Key": "7fe356965emsha4a36952851d8cdp17f29bjsn1cff5cbe731a",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };

    let jobSearch;
    await axios
      .request(options)
      .then(function (response) {
        jobSearch = response.data.data;
      })
      .catch(function (error) {
        errorsList = errorsList.push(error);
      });
    if (errorsList.length > 0)
      res.render("skills/skillsApi", {
        title: "API Search",
        h1: "API Search",
        errorsList: errorsList,
        job_title: job_title,
        location: location,
      });
    res.render("skills/skillsApi", {
      Id: req.session.user.userId,
      title: "API Search",
      h1: "API Search",
      jobSearch: jobSearch,
    });
  });

export default router;
