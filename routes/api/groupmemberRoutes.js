const router = require('express').Router();
const { GroupMember, Group, Character, Notification } = require('../../models');
const jwt = require("jsonwebtoken");

//apply for group
router.post("/:group_id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const group = await Group.findByPk(req.params.group_id, {
            include: [{
                model: Character,
                as: 'creator'
            }, {
                model: Character,
                as: 'app_char',
                where: { '$app_char.groupmember.approved$': false }, required: false,
            },]
        });
        if (!group) {
            return res.status(404).json({ msg: "group not found" });
        }
        await GroupMember.create({
            group_id: req.params.group_id,
            char_id: req.body.char_id,
        })
        let noti = await Notification.findOne({
            where: {
                receiver_id: group.creator.owner_id,
                message: `New Applicants in Group: ${group.group_name}`,
                group_id: curGroup.id,
            },
        })
        if (!noti) {
            noti = await Notification.create({
                receiver_id: group.creator.owner_id,
                message: `New Applicants in Group: ${group.group_name}`,
                group_id: curGroup.id,
            })
        }
        if (noti.read) {
            await Notification.update({
                read: false,
            })
            noti.read = false;
        }
        res.json(noti);
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
        await GroupMember.update({
            approved: true
        }, {
            where: {
                group_id: curGroup.id,
                char_id: req.body.char_id,
            }
        })
        const receiver = await Character.findByPk(req.body.char_id);
        const newNoti = await Notification.create({
            receiver_id: receiver.owner_id,
            message: `You were ACCEPTED into the Group: ${curGroup.group_name}`,
            group_id: curGroup.id,
        })
        res.json(newNoti);
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
            // pass all checks, go ahead and delete group member
            const delMember = await GroupMember.destroy({
                where: {
                    group_id: req.params.group_id,
                    char_id: charLeaving,
                }
            })
            res.json(delMember)
        } else {
            // pass all checks, go ahead and delete group member
            await GroupMember.destroy({
                where: {
                    group_id: req.params.group_id,
                    char_id: charLeaving,
                }
            })
            const receiver = await Character.findByPk(req.body.char_id);
            const newNoti = await Notification.create({
                receiver_id: receiver.owner_id,
                message: `You were REJECTED from the Group: ${curGroup.group_name}`,
                group_id: curGroup.id,
            })
            res.json(newNoti);
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;