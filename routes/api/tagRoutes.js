const router = require('express').Router();
const { Tag } = require('../../models');

//find all
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;