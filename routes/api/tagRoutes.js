const router = require('express').Router();
const { Tag, Group } = require('../../models');

//find all
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.findAll({
            include:[{
                model: Group,
                //attributes: '$group.group_name$'
            }]
        });
        res.json(tags);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;