/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersGratuity', {
        gratuity_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        gratuity_money: {
            type: DataTypes.FLOAT,
        },
        touser_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        message: {
            type: DataTypes.STRING(255),
        },
        wxpay_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        create_time: {
            type: DataTypes.TIME,
        }
    }, {
        tableName: 'szj_users_gratuity'
    });
    Model.associate = function() {
        //关联用户表
        Model.belongsTo(app.model.Users,{foreignKey:'user_id',targetKey:'user_id',as:'users'});
    }
    return Model;
};
