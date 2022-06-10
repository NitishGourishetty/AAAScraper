module.exports = (sequelize, DataTypes) => {
    const States = sequelize.define("States", {
        stateName: {
            type: DataTypes.STRING,
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
        }
    })

    return States
}