/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersOrder', {
        order_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        pay_money: {
            type: DataTypes.FLOAT,
        },
        is_pay: {
            type: DataTypes.INTEGER(1).UNSIGNED,
        },
        view_count: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        update_time: {
            type: DataTypes.TIME,
        },
        create_time: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'szj_users_order'
    });
    Model.associate = function() {

    }
    return Model;
};
