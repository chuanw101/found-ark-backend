const router = require('express').Router();
const { Notification } = require('../../models');
const jwt = require("jsonwebtoken");

//find all by receiver_id
router.get("/receiver/:receiver_id", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ").pop();
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenData?.id != req.params.receiver_id) {
            return res.status(401).json({ msg:"You are not authorized view this"})
        }

        const notis = await Notification.findAll({
            where: {
                receiver_id: req.params.receiver_id,
            }
        });
        res.json(notis);
    }
    catch (err) {
        res.status(500).json({ msg: "an error occured", err });
    }
});

module.exports = router;