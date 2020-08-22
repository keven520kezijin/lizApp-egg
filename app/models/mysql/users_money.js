/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersMoney', {
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey:true
        },
        base_money: {
            type: DataTypes.FLOAT,
        },
        other_money: {
            type: DataTypes.FLOAT,
        },
        update_time: {
            type: DataTypes.TIME
        }
    }, {
        tableName: 'szj_users_money'
    });
    Model.associate = function() {
        //用户资金表
        Model.belongsTo(app.model.Users,{foreignKey:'user_id',targetKey:'user_id',as:'users'});
    }
    return Model;
};
