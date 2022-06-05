const sequelize = require("../config/connection");
const { User, Group, Character, GroupMember, GroupTag, Tag } = require("../models");

const users = [
    {
        user_name: "chuan",
        password: "password",
        region: "NAW",
    },
    {
        user_name: "chuan2",
        password: "password",
        region: "NAW",
    },
    {
        user_name: "chuan101",
        password: "password",
        region: "NAW",
    },
]

const chars = [
    {
        owner_id: 1,
        char_name: "ffffffffffffffffeed",
        class: "berserker",
        item_lvl: 1470,
        roster_lvl: 141,
        char_lvl: 58,
        engravings: "5x3",
    }
]

const groups = [
    {
        group_name: "test group",
        creator_char_id:1,
        region:"NAW",
    },
    {
        group_name: "test group2",
        creator_char_id:1,
        region:"NAW",
    }
]

const groupmember = [
    {
        group_id:1,
        char_id:1,
    },
    {
        group_id:2,
        char_id:1,
    }
]

const tags = [
    {
        tag_name:"cool"
    },
    {
        tag_name:"fun"
    },
    {
        tag_name:"nice"
    }
]

const grouptags = [
    {
        group_id:1,
        tag_id:1,
    },
    {
        group_id:2,
        tag_id:1,
    },
    {
        group_id:1,
        tag_id:2,
    },
    {
        group_id:2,
        tag_id:3,
    }
]

const feedMe = async () => {
    try {
        await sequelize.sync({ force: true });
        await User.bulkCreate(users, {
            individualHooks: true
        });
        await Character.bulkCreate(chars);
        await Group.bulkCreate(groups);
        await GroupMember.bulkCreate(groupmember);
        await Tag.bulkCreate(tags);
        await GroupTag.bulkCreate(grouptags);
        process.exit(0);
    } catch (err) {
        console.log(err)
    }
}

feedMe()