import { Router } from "express";
import skillsData from "../data/skills.js";
import validations from "../helpers.js";
import axios from 'axios';

const router = Router();

router.route('/')
    .get(async (req, res) =>
    {
        let skills = await skillsData.getAllSkills();
        return res.render("skills/skillsHome", { title: "Skills Home", h1: "Skills Home", Id: req.session.user.userId, skills: skills })
    })

router.route('/create/:userId')
    .get(async (req, res) =>
    {
        return res.render("skills/skillsNewPost", { title: "New Post", h1: "New Post", Id: req.params.userId })
    })
    .post(async (req, res) =>
    {
        const body = req.body;
        let { postTitle, article, interest, url } = body;
        let userId = req.session.user.userId;
        let errors = []

        try
        {
            userId = validations.checkId(userId)
        } catch(error)
        {
            errors.push(error)
        }
        try
        {
            postTitle = validations.checkString(postTitle, "Title");
        } catch(error)
        {
            errors.push(error)
        }

        try
        {
            article = validations.checkString(article, "Article");
        } catch(error)
        {
            errors.push(error)
        }

        try
        {
            url = validations.checkVideoUrl(url, "Video link")
        } catch(error)
        {
            errors.push(error)
        }

        try
        {
            interest = validations.checkTags(interest, "Interest")
        } catch(error)
        {
            errors.push(error)
        }

        if(errors.length > 0)
        {
            return res.render("skills/skillsNewPost", { title: "New Post", h1: "New Post", Id: userId, postTitle: postTitle, article: article, url: url, errors: errors });
        }

        try
        {
            let createInfo = await skillsData.createSkills(userId, postTitle, article, url, interest);
            res.redirect("/skills");
        } catch(error)
        {
            return res.status(404).json(error)
        }
    })

router.route("/search/api")
    .get(async (req, res) =>
    {
        return res.render("skills/skillsApi", { title: "API Search", h1: "API Search", Id: req.session.user.userId })
    })
    .post(async (req, res) =>
    {
        let errorsList = [];
        let { job_title, location, page, date_post, employment_types, job_requirements, remote_jobs_only } = req.body;
        try
        {
            job_title = validations.checkString(job_title, "Job Title")
        } catch(error)
        {
            errorsList.push(error)
        }

        try
        {
            location = validations.checkString(location, "Location")
        } catch(error)
        {
            errorsList.push(error)
        }

        if(errorsList.length > 0)
            return res.render("skills/skillsApi",
                {
                    title: "API Search",
                    h1: "API Search",
                    job_title: job_title,
                    location: location,
                    errorsList: errorsList
                });


        const query = job_title.concat(' ', location)
        const params = {
            query: query,
            page: page,
            date_post: date_post,
            employment_types: employment_types,
            job_requirements: job_requirements,
            remote_jobs_only: remote_jobs_only
        }

        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: params,
            headers: {
                'X-RapidAPI-Key': '7fe356965emsha4a36952851d8cdp17f29bjsn1cff5cbe731a',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        let jobSearch;
        await axios.request(options).then(function(response)
        {
            jobSearch = response.data.data
        }).catch(function(error)
        {
            errorsList = errorsList.push(error);
        });
        if(errorsList.length > 0)
            return res.render("skills/skillsApi", { title: "API Search", h1: "API Search", errorsList: errorsList });
        return res.render("skills/skillsApi", { title: "API Search", h1: "API Search", jobSearch: jobSearch })
    })

export default router;
