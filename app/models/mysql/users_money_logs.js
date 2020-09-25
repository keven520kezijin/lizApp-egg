/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersMoneyLogs', {
        log_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        money: {
            type: DataTypes.FLOAT,
        },
        money_desc: {
            type: DataTypes.STRING(255),
        },
        create_time: {
            type: DataTypes.TIME
        }
    }, {
        tableName: 'szj_users_money_logs'
    });
    Model.associate = function() {
        
    }
    return Model;
};
