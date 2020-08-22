/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersShare', {
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
        },
        videos: {
            type: DataTypes.TEXT,
        },
        update_time: {
            type: DataTypes.TIME
        }
    }, {
        tableName: 'szj_users_share'
    });
    Model.associate = function() {

    }
    return Model;
};
