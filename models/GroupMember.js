const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GroupMember extends Model { }

GroupMember.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'group',
            key: 'id',
        }
    },
    // user_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'user',
    //         key: 'id',
    //     }
    // },
    char_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'character',
            key: 'id',
        }
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'groupmember',
});

module.exports = GroupMember