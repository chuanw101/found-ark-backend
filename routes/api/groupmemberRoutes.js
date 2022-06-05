const router = require('express').Router();
const { GroupMember, Group, Character } = require('../../models');
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
            char_id: req.body.char_id,
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
        const curGroup = await Group.findByPk(req.params.group_id, {
            include: [{
                model: Character,
                as: 'creator',
            }]
        });
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        if (curGroup?.creator?.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "only creator can approve members" });
        }
        const updatedMember = await GroupMember.update({
            approved: true
        }, {
            where: {
                group_id: curGroup.id,
                char_id: req.body.char_id,
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
        const curGroup = await Group.findByPk(req.params.group_id, {
            include: [{
                model: Character,
                as: 'creator',
            }]
        });
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        const charLeaving = req.body.char_id;
        if (!charLeaving) {
            return res.status(404).json({ msg: "must enter char_id" });
        }
        // check if char_id entered belongs to user if not creator of group
        if (curGroup?.creator?.owner_id != tokenData.id) {
            const curChar = await Character.findByPk(req.body.char_id);
            if (curChar.owner_id != tokenData.id) {
                return res.status(401).json({ msg: "that's not your character" });
            }
        }
        // pass all checks, go ahead and delete group member
        const delMember = await GroupMember.destroy({
            where: {
                group_id: req.params.group_id,
                char_id: charLeaving,
            }
        })
        res.json(delMember);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;