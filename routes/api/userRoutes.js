const router = require('express').Router();
const { User, Character, Group, Tag, Notification } = require('../../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//find all
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Character,
                include: [{
                    model: Group,
                    as: 'joined',
                    where: { '$characters.joined.groupmember.approved$': true }, required: false,
                }, {
                    model: Group,
                    as: 'applied',
                    where: { '$characters.applied.groupmember.approved$': false }, required: false,
                }, {
                    model: Group,
                    as: 'created',
                },],
            },],
        })
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//find user by id
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Character,
                include: [{
                    model: Group,
                    as: 'joined',
                    where: { '$characters.joined.groupmember.approved$': true }, required: false,
                    include: [{
                        model: Character,
                        as: 'member_char',
                        attributes: {exclude: ['$characters.json_data$']},
                        where: { '$characters.joined.member_char.groupmember.approved$': true }, required: false,
                    }, {
                        model: Tag,
                        as: 'tag',
                    }],
                }, 
                // {
                //     model: Group,
                //     as: 'applied',
                //     where: { '$characters.applied.groupmember.approved$': false }, required: false,
                //     include: [{
                //         model: Character,
                //         as: 'member_char',
                //         where: { '$characters.joined.member_char.groupmember.approved$': true }, required: false,
                //     }, {
                //         model: Tag,
                //         as: 'tag',
                //     }],
                // }, {
                //     model: Group,
                //     as: 'created',
                //     include: [{
                //         model: Character,
                //         as: 'member_char',
                //         where: { '$characters.joined.member_char.groupmember.approved$': true }, required: false,
                //     }, {
                //         model: Tag,
                //         as: 'tag',
                //     }],
                // },
                ],
            },],
            order: [
                [Character, { model: Group, as: 'joined' }, 'updatedAt', 'DESC']
            ],
        })
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//update user
router.put("/:id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenData?.id != req.params.id) {
            return res.status(401).json({ msg: "You are not authorized to change this user " })
        }

        await User.update({
            region: req.body.region,
            introduction: req.body.introduction,
        }, {
            where: {
                id: req.params.id,
            }
        });

        const newToken = jwt.sign(
            {
                user_name: tokenData.user_name,
                id: req.params.id,
                region: req.body.region,
                logged_in: true,
            },
            process.env.JWT_SECRET,
        );
        const updatedUser = await User.findByPk(req.params.id);
        return res.json({
            token: newToken,
            user: updatedUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({
            include: [{
                model: Notification,
                as: 'notis',
            }],
            where: {
                user_name: req.body.user_name
            }
        })
        if (!foundUser) {
            return res.status(400).json({ msg: "wrong login credentials" })
        }
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            const token = jwt.sign(
                {
                    user_name: foundUser.user_name,
                    id: foundUser.id,
                    region: foundUser.region,
                    logged_in: true,
                },
                process.env.JWT_SECRET,
            );
            return res.json({
                token: token,
                user: foundUser
            });
        } else {
            return res.status(400).json({ msg: "wrong login credentials" })
        }
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//  change password
router.put('/changepw/:id', async (req, res) => {
    try {
        if (!req.body?.newPass) {
            return res.status(404).json({ msg: "must enter new password!" });
        }
        const userDb = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        if (bcrypt.compareSync(req.body.currentPass, userDb.password)) {
            await User.update(
                {
                    password: req.body.newPass,
                }, {
                where: {
                    id: req.params.id
                },
                individualHooks: true,
            });
            res.send("Password changed");
        }
        else {
            res.status(401).send("The current password does not match");
        }
    } catch (err) {
        res.status(500).send({ err, msg: "Password change failed!" })
    }
});

// signup
router.post("/signup", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        //creating the token 
        const token = jwt.sign(
            {
                user_name: newUser.user_name,
                id: newUser.id,
                region: newUser.region,
                logged_in: true,
            },
            process.env.JWT_SECRET,
        );
        res.json({
            token: token,
            user: newUser
        });
    } catch (err) {
        res.status(500).json({ msg: "User name taken", err });
    }
});

module.exports = router;