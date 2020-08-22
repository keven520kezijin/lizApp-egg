/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersSeach', {
        seach_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        tag_name: {
            type: DataTypes.STRING(255),
        },
        seach_total:{
            type: DataTypes.INTEGER(11),
        },
        update_time: {
            type: DataTypes.TIME,
        }
    }, {
        tableName: 'szj_users_seach'
    });
    Model.associate = function() {

    }
    return Model;
};
