/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('Users', {
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nickname: {
            type: DataTypes.STRING(255),
        },
        openid: {
            type: DataTypes.STRING(50),
        },
        user_status: {
            type: DataTypes.INTEGER(1).UNSIGNED,
        },
        avatarurl: {
            type: DataTypes.STRING(255),
        },
        gender: {
            type: DataTypes.CHAR(1),
        },
        user_type: {
            type: DataTypes.INTEGER(3).UNSIGNED,
        },
        city: {
            type: DataTypes.STRING(30),
        },
        province: {
            type: DataTypes.STRING(30),
        },
        country: {
            type: DataTypes.STRING(30),
        },
        active_time: {
            type: DataTypes.DATE,
        },
        create_time: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'szj_users'
    });
    Model.associate = function() {
        Model.belongsTo(app.model.UsersMoney,{foreignKey:'user_id',targetKey:'user_id',as:'users_money'});
        Model.belongsTo(app.model.RealName,{foreignKey:'user_id',targetKey:'user_id',as:'real'});
    }
    return Model;
};
