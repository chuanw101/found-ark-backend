const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GroupTag extends Model { }

GroupTag.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    group_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'group',
            key: 'id',
        }
    },
    tag_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tag',
            key: 'id',
        }
    },
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'grouptag',
});

module.exports = GroupTag