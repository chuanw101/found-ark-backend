const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Notification extends Model { }

Notification.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    group_id: {
        type: DataTypes.INTEGER,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'notification',
});

module.exports = Notification