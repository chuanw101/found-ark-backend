const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Character extends Model { }

Character.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
    char_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    item_lvl: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roster_lvl: {
        type: DataTypes.INTEGER,
    },
    char_lvl: {
        type: DataTypes.INTEGER,
    },
    engravings: {
        type: DataTypes.STRING,
    },
    json_data: {
        type: DataTypes.TEXT,
    }
}, {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'character',
});

module.exports = Character