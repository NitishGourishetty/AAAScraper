module.exports = (sequelize, DataTypes) => {
    const States = sequelize.define("States", {
        stateName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        metro: {
            type: DataTypes.STRING,
            allowNull: false, sequelizevalidate: {
                notEmpty: true
            }
        },
        day: {
            type: DataTypes.INTEGER,
            allowNull: false, sequelizevalidate: {
                notEmpty: true
            }
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false, sequelizevalidate: {
                notEmpty: true
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false, sequelizevalidate: {
                notEmpty: true
            }
        },
        regular: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        midgrade: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        premium: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        diesel: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    })

    return States
}