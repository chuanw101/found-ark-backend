const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require("bcrypt")

class User extends Model { }

User.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [0, 15],
            isAlphanumeric: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8]
        }
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    introduction: {
        type: DataTypes.STRING,
        defaultValue: "Hi~",
    },
}, {
    hooks: {
        beforeCreate: async userData => {
            userData.password = await bcrypt.hash(userData.password, 5)
            return userData
        },
        beforeUpdate: async userData => {
            userData.password = await bcrypt.hash(userData.password, 5)
            return userData
        }
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
});

module.exports = User