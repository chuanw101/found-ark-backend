const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Group extends Model { }

Group.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    creator_char_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'character',
            key: 'id',
        }
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: 'Come join us!',
    },
    discord: {
        type: DataTypes.STRING,
    },
    time: {
        type: DataTypes.DATE,
    },
}, {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'group',
});

module.exports = Group