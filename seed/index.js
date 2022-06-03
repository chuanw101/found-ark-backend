const sequelize = require("../config/connection");
const { User, Group, Character, GroupMember, GroupTag, Tag } = require("../models");

const feedMe = async () => {
    try {
        process.exit(0);
    } catch (err) {
        console.log(err)
    }
}

feedMe()