// import models
const User = require('./User');
const Group = require('./Group');
const Character = require('./Character');
const Tag = require('./Tag');
const GroupMember = require('./GroupMember');
const GroupTag = require('./GroupTag');

// Many Character belong to one User(owner)
Character.belongsTo(User, {
    as: 'owner',
    foreignKey: "owner_id",
    onDelete: "CASCADE",
});
User.hasMany(Character, {
    foreignKey: "owner_id"
});

// Many Group belong to one User(creator)
Group.belongsTo(User, {
    as: 'creator',
    foreignKey: "creator_id"
});
User.hasMany(Group, {
    foreignKey: "creator_id"
});

// Many to many relationship between User and Group through GroupMember
User.belongsToMany(Group, {
    through: GroupMember,
    as: "mygroup",
    foreignKey: 'user_id',
});
Group.belongsToMany(User, {
    through: GroupMember,
    as: 'applicant',
    foreignKey: 'group_id',
});
Group.belongsToMany(User, {
    through: GroupMember,
    as: 'member',
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