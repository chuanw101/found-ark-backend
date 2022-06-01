const router = require('express').Router();
const { User, Group, Tag, GroupTag } = require('../../models');

//find all
router.get("/", async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{
                model: User,
                as: 'creator',
            }, {
                model: User,
                as: 'member',
                where: { '$member.groupmember.approved$': true }, required: false
            }, {
                model: User,
                as: 'applicant',
                where: { '$applicant.groupmember.approved$': false }, required: false
            }, {
                model: Tag,
                as: 'tag',
            }],
        })
        res.json(groups);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//find group by id
router.get("/:id", async (req, res) => {
    try {
        const group = await Group.findByPk(params.req.id, {
            include: [{
                model: User,
                as: 'creator',
            }, {
                model: User,
                as: 'member',
                where: { '$member.groupmember.approved$': true }, required: false
            }, {
                model: User,
                as: 'applicant',
                where: { '$applicant.groupmember.approved$': false }, required: false
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
    if (!req.session.user) {
        return res.status(401).json({ msg: "must log in to create group!" })
    }
    try {
        const newGroup = await Group.create({
            creator_id: req.session.user.id,
            group_name: req.body.group_name,
            description: req.body.description,
            discord: req.body.discord,
            time: req.body.time,
        });
        if (req.body.tags?.length) {
            // create tag if not already in db, create association with group
            for (const tag of req.body.tags) {
                const curTag = await Tag.findOrCreate({ where: { tag_name: tag } });
                await GroupTag.create({
                    group_id: newGroup.id,
                    tag_id: curTag.id,
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
    if (!req.session?.user) {
        return res.status(401).json({ msg: "must log in to update group!" })
    }
    try {
        const curGroup = await Group.findByPk(req.params.id);
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can update Group
        if (curGroup.creator_id != req.session?.user?.id) {
            return res.status(401).json({ msg: "You don't have access to update this group!" })
        }
        const updatedGroup = await Group.update({
            group_name: req.body.group_name,
            description: req.body.description,
            discord: req.body.discord,
            time: req.body.time,
        }, {
            where: {
                id: req.params.id,
                creator_id: req.session.user.id
            }
        });
        res.json(updatedGroup);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//create new tag for group
router.post("/:id/tag/:tag_name", async (req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({ msg: "must log in to update group!" })
    }
    try {
        const curGroup = await Group.findByPk(req.params.id);
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can add new tag
        if (curGroup.creator_id != req.session?.user?.id) {
            return res.status(401).json({ msg: "You don't have access to add tag for this group!" })
        }
        const curTag = await Tag.findOrCreate({ where: { tag_name: req.params.tag_name } });
        await GroupTag.create({
            group_id: curGroup.id,
            tag_id: curTag.id,
        })
        res.json(curTag);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//delete tag for group
router.delete("/:id/tag/:tag_name", async (req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({ msg: "must log in to update group!" })
    }
    try {
        const curGroup = await Group.findByPk(req.params.id);
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can add new tag
        if (curGroup.creator_id != req.session?.user?.id) {
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
    if (!req.session.user) {
        return res.status(401).json({ msg: "must log in to delete Group!" })
    }
    try {
        const curGroup = await Group.findByPk(req.params.id);
        if (!curGroup) {
            return res.status(404).json({ msg: "group not found" });
        }
        // only creator can delete Group
        if (curGroup.creator_id != req.session?.user?.id) {
            return res.status(401).json({ msg: "you don't have access to delete this Group!" });
        }
        const curTag = await Tag.findOne({ where: { tag_name: req.params.tag_name } });
        if (!curTag) {
            return res.status(404).json({ msg: "tag not found"} );
        }
        const delGroup = await Group.destroy({
            where: {
                group_id: curGroup.id,
                tag_id: curTag.id,
            }
        })
        res.json(delGroup);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;