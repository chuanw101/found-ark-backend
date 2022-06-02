const router = require('express').Router();
const { Character, User } = require('../../models');
const jwt = require("jsonwebtoken");

//find all
router.get("/", async (req, res) => {
    try {
        const characters = await Character.findAll({
            include: [{
                model: User,
                as: 'owner',
            }]
        });
        res.json(characters);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//find character by id
router.get("/:id", async (req, res) => {
    try {
        const character = await Character.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'owner',
            }]
        });
        res.json(character);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//find character by owner_id
router.get("/owner/:owner_id", async (req, res) => {
    try {
        const characters = await Character.findAll({
            include: [{
                model: User,
                as: 'owner',
            }],
            where: {'owner_id': req.params.owner_id}
        })
        res.json(characters);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

//add character to logged in user
router.post("/", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const newChar = await Character.create({
            owner_id: tokenData.id,
            char_name: req.body.char_name,
            class: req.body.class,
            item_lvl: req.body.item_lvl,
            roster_lvl: req.body.roster_lvl,
            char_lvl: req.body.char_lvl,
            engravings: req.body.engravings,
            json_data: req.body.json_data,
        });
        res.json(newChar);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//update character
router.put("/:id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const curCharacter = await Character.findByPk(req.params.id);
        // only creator can update Character
        if (curCharacter.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "You don't have access to change this Character!" })
        }
        const updatedCharacter = await Character.update({
            char_name: req.body.char_name,
            class: req.body.class,
            item_lvl: req.body.item_lvl,
            roster_lvl: req.body.roster_lvl,
            char_lvl: req.body.char_lvl,
            engravings: req.body.engravings,
            json_data: req.body.json_data,
        }, {
            where: {
                id: req.params.id,
            }
        });
        res.json(updatedCharacter);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

//delete a Character
router.delete("/:id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const curCharacter = await Character.findByPk(req.params.id);
        // only creator can delete Character
        if (curCharacter.owner_id != tokenData.id) {
            return res.status(401).json({ msg: "you don't have access to delete this Character!" })
        }
        const delCharacter = await Character.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json(delCharacter);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;