import {Router} from 'express';
import team from "../data/team.js"

const router = Router()

router.route('/').get(async (req, res) => {
    try {
        return res.json({name: "Group 15 Web Development", try: "/team"});
    } catch (e) {
        res.status(404).json(e);
    }
})

router.route('/team').get(async (req, res) => {
    try {
        return res.send(await team.getAllTeamMates());
    } catch (e) {
        res.status(404).json(e);
    }
})

router.route('/teamPush').get(async (req, res) => {
    try {
        const data = await team.pushAllTeamMates()
        console.log(data)
        return res.json(data);
    } catch (e) {
        res.status(404).json(e);
    }
})

export default router