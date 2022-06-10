const router = require('express').Router();
const { Tag, Group } = require('../../models');

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

//find top tags
router.get("/top/:limit", async (req, res) => {
    try {
        const tags = await Tag.findAll({
            limit: req.params.limit,
            include:[{
                model: Group,
                attributes:[
                    [Sequelize.fn('COUNT', '*'), 'num_of_group']
                ]
            }],
            order: [
                ['num_of_group']
            ]
        });
        res.json(tags);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});


module.exports = router;