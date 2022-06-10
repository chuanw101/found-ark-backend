const router = require('express').Router();
const { User, Group, Tag, GroupTag, GroupMember, Character, Notification } = require('../../models');
const jwt = require("jsonwebtoken");

//find all, only show groups in user region if logged in
//if filter should be /?filter=filter1&filter=filter2 etc.
router.get("/", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        if (!token) {
            if (req.query?.filter) {
                const groups = await Group.findAll({
                    include: [{
                        model: Character,
                        as: 'creator',
                        include: [{
                            model: User,
                            as: 'owner',
                        }]
                    }, {
                        model: Character,
                        as: 'app_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$app_char.groupmember.approved$': false }, required: false,
                    }, {
                        model: Character,
                        as: 'member_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$member_char.groupmember.approved$': true }, required: false,
                    }, {
                        model: Tag,
                        as: 'tag',
                    }],
                    order: [['updatedAt', 'DESC']]
                })
                res.json(groups);
            } else {
                const groups = await Group.findAll({
                    include: [{
                        model: Character,
                        as: 'creator',
                        include: [{
                            model: User,
                            as: 'owner',
                        }]
                    }, {
                        model: Character,
                        as: 'app_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$app_char.groupmember.approved$': false }, required: false,
                    }, {
                        model: Character,
                        as: 'member_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$member_char.groupmember.approved$': true }, required: false,
                    }, {
                        model: Tag,
                        as: 'tag',
                    }],
                    order: [['updatedAt', 'DESC']]
                })
                res.json(groups);
            }
        } else {
            const tokenData = jwt.verify(token, process.env.JWT_SECRET);
            if (req.query?.filter) {
                const groups = await Group.findAll({
                    include: [{
                        model: Character,
                        as: 'creator',
                        include: [{
                            model: User,
                            as: 'owner',
                        }]
                    }, {
                        model: Character,
                        as: 'app_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$app_char.groupmember.approved$': false }, required: false,
                    }, {
                        model: Character,
                        as: 'member_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$member_char.groupmember.approved$': true }, required: false,
                    }, {
                        model: Tag,
                        as: 'tag',
                    }],
                    where: { 'region': tokenData.region },
                    order: [['updatedAt', 'DESC']]
                })
                res.json(groups);
            } else {
                const groups = await Group.findAll({
                    include: [{
                        model: Character,
                        as: 'creator',
                        include: [{
                            model: User,
                            as: 'owner',
                        }]
                    }, {
                        model: Character,
                        as: 'app_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$app_char.groupmember.approved$': false }, required: false,
                    }, {
                        model: Character,
                        as: 'member_char',
                        include: [{
                            model: User,
                            as: 'owner',
                        }],
                        where: { '$member_char.groupmember.approved$': true }, required: false,
                    }, {
                        model: Tag,
                        as: 'tag',
                    }],
                    where: { 'region': tokenData.region },
                    order: [['updatedAt', 'DESC']]
                })
                res.json(groups);
            }
        }
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//find group by id
router.get("/:id", async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            include: [{
                model: Character,
                as: 'creator',
                include: [{
                    model: User,
                    as: 'owner',
                }]
            }, {
                model: Character,
                as: 'app_char',
                include: [{
                    model: User,
                    as: 'owner',
                }],
                where: { '$app_char.groupmember.approved$': false }, required: false,
            }, {
                model: Character,
                as: 'member_char',
                include: [{
                    model: User,
                    as: 'owner',
                }],
                where: { '$member_char.groupmember.approved$': true }, required: false,
            }, {
                model: Tag,
                as: 'tag',
            }],
        })
        res.json(group);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//create group, including tags
router.post("/", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const newGroup = await Group.create({
            creator_char_id: req.body.creator_char_id,
            region: tokenData.region,
            group_name: req.body.group_name,
            description: req.body.description,
            discord: req.body.discord,
            time: req.body.time,
        });
        // join group your self
        await GroupMember.create({
            group_id: newGroup.id,
            char_id: req.body.creator_char_id,
            approved: true,
            is_owner: true,
        });
        if (req.body.tags?.length) {
            // create tag if not already in db, create association with group
            for (const tag of req.body.tags) {
                const curTag = await Tag.findOrCreate({ where: { tag_name: tag } });
                const data = curTag[0];
                await GroupTag.create({
                    group_id: newGroup.id,
                    tag_id: data.id,
                })
            }
        }
        res.json(newGroup);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//update group, not including tags
router.put("/:id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const curGroup = await Group.findByPk(req.params.id, {
            include: [{
                model: Character,
                as: 'creator',
            }, {
                model: Tag,
                as: 'tag',
            }]
        });
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can update Group
        if (curGroup?.creator?.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "You don't have access to update this group!" })
        }
        const updatedGroup = await Group.update({
            group_name: req.body.group_name,
            description: req.body.description,
            discord: req.body.discord,
            time: req.body.time,
        }, {
            where: {
                id: req.params.id
            }
        });
        if (req.body.tags?.length) {
            if (!curGroup.tag.length) {
                return res.json(updatedGroup);
            }
            const oldTags = curGroup.tag.map(t=>t.tag_name);
            const unChangedTags = req.body.tags.filter(t => oldTags.includes(t));
            const newTags = req.body.tags.filter(t => !unChangedTags.include(t));
            const delTags = oldTags.filter(t => !unChangedTags.include(t));
            // create tag if not already in db, create association with group
            for (const tag of newTags) {
                const curTag = await Tag.findOrCreate({ where: { tag_name: tag } });
                const data = curTag[0];
                await GroupTag.create({
                    group_id: curGroup.id,
                    tag_id: data.id,
                })
            }
            for (const tag of delTags) {
                const curTag = await Tag.findAll({ where: { tag_name: tag } });
                const data = curTag[0];
                await GroupTag.destroy({
                    where: {
                        group_id: curGroup.id,
                        tag_id: data.id,
                    }
                })
            }
        }
        res.json(updatedGroup);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//create new tag for group
router.post("/:id/tag/:tag_name", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const curGroup = await Group.findByPk(req.params.id, {
            include: [{
                model: Character,
                as: 'creator',
            }]
        });
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can add new tag
        if (curGroup?.creator?.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "You don't have access to add tag for this group!" })
        }
        const curTag = await Tag.findOrCreate({ where: { tag_name: req.params.tag_name } });
        const data = curTag[0];
        const newTag = await GroupTag.findOrCreate({
            where: {
                group_id: curGroup.id,
                tag_id: data.id,
            }
        })
        res.json(newTag);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//delete tag for group
router.delete("/:id/tag/:tag_name", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const curGroup = await Group.findByPk(req.params.id, {
            include: [{
                model: Character,
                as: 'creator',
            }]
        });
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can add new tag
        if (curGroup?.creator?.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "You don't have access to add tag for this group!" })
        }
        const curTag = await Tag.findOne({ where: { tag_name: req.params.tag_name } });
        if (!curTag) {
            return res.status(404).json({ msg: "Tag not found" });
        }
        const delGroupTag = await GroupTag.destroy({
            where: {
                group_id: curGroup.id,
                tag_id: curTag.id,
            }
        })
        res.json(delGroupTag);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//delete a Group
router.delete("/:id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const curGroup = await Group.findByPk(req.params.id, {
            include: [{
                model: Character,
                as: 'creator',
            }, {
                model: Character,
                as: 'member_char',
                where: { '$member_char.groupmember.approved$': true }, required: false,
            }]
        });
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can delete Group
        if (curGroup?.creator?.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "you don't have access to delete this Group!" });
        }
        let notis = [];
        for (const c of curGroup.member_char) {
            if (c.owner_id != curGroup?.creator?.owner_id) {
                const newNoti = await Notification.create({
                    receiver_id: c.owner_id,
                    message: `The Group ${curGroup.group_name} was DELETED`,
                    group_id: curGroup.id,
                })
                notis.push(newNoti);
            }
        }
        await Group.destroy({
            where: {
                id: req.params.id,
            }
        })
        res.json(notis);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;