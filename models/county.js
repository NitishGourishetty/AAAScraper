module.exports = (sequelize, DataTypes) => {
    const county = sequelize.define("county", {
        stateName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        countyName: {
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
        gasPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })

    return county
}