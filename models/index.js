// import models
const User = require('./User');
const Group = require('./Group');
const Character = require('./Character');
const Tag = require('./Tag');
const GroupMember = require('./GroupMember');
const GroupTag = require('./GroupTag');
const Notification = require('./Notification');

// Many Character belong to one User(owner)
Character.belongsTo(User, {
    as: 'owner',
    foreignKey: "owner_id",
    onDelete: "CASCADE",
});
User.hasMany(Character, {
    foreignKey: "owner_id"
});

// Many Group belong to one Character(creator)
Group.belongsTo(Character, {
    as: 'creator',
    foreignKey: "creator_char_id"
});
Character.hasMany(Group, {
    as: 'created',
    foreignKey: "creator_char_id"
});

// Many Notification belong to one user (reciever)
Notification.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiver_id'
});
User.hasMany(Notification, { 
    as: 'notis',
    foreignKey: 'receiver_id'
})

// Many to many relationship between User and Group through GroupMember
// User.belongsToMany(Group, {
//     through: GroupMember,
//     as: 'joinedgroup',
//     foreignKey: 'user_id',
// });
// Group.belongsToMany(User, {
//     through: GroupMember,
//     as: 'applicant',
//     foreignKey: 'group_id',
// });
// Group.belongsToMany(User, {
//     through: GroupMember,
//     as: 'member',
//     foreignKey: 'group_id',
// });

// Many to many relationship between Character and Group through GroupMember
Character.belongsToMany(Group, {
    through: GroupMember,
    as: "joined",
    foreignKey: 'char_id',
});
Character.belongsToMany(Group, {
    through: GroupMember,
    as: "applied",
    foreignKey: 'char_id',
});
Group.belongsToMany(Character, {
    through: GroupMember,
    as: 'app_char',
    foreignKey: 'group_id',
});
Group.belongsToMany(Character, {
    through: GroupMember,
    as: 'member_char',
    foreignKey: 'group_id',
});

// Many to many relationship between Tag and Group through GroupTag
Tag.belongsToMany(Group, {
    through: GroupTag,
    foreignKey: 'tag_id',
});
Group.belongsToMany(Tag, {
    through: GroupTag,
    as: 'tag',
    foreignKey: 'group_id',
});

module.exports = {
    Group,
    User,
    Character,
    Tag,
    GroupTag,
    GroupMember,
};