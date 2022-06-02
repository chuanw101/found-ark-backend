const router = require('express').Router();
const { GroupMember, Group } = require('../../models');
const jwt = require("jsonwebtoken");

//apply for group
router.post("/:group_id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const group = await Group.findByPk(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: "group not found" });
        }
        const newGroupMember = await GroupMember.create({
            group_id: req.params.group_id,
            user_id: tokenData.id,
            character_id: req.body.character_id,
        })
        res.json(newGroupMember);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//approve application
router.put("/:group_id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const group = await Group.findByPk(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: "group not found" });
        }
        if (group.creator_id != tokenData.id) {
            return res.status(401).json({ msg: "only creator can approve members" });
        }
        const updatedMember = await GroupMember.update({
            approved: true
        }, {
            where: {
                group_id: group.id,
                user_id: req.body.user_id,
            }
        })
        res.json(updatedMember);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//leave group if not creator, reject user if creator
router.delete("/:group_id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const group = await Group.findByPk(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: "group not found" });
        }
        let userLeaving;
        if (group.creator_id == tokenData.id) {
            userLeaving = req.body.user_id;
            if (!userLeaving) {
                return res.status(404).json({ msg: "must enter the user you are rejecting" });
            }
        } else {
            userLeaving = tokenData.id;
        }

        const delMember = await GroupMember.destroy({
            where: {
                group_id: req.params.group_id,
                user_id: userLeaving,
            }
        })
        res.json(delMember);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;