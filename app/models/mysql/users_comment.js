/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('UsersComment', {
        comment_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        content: {
            type: DataTypes.STRING(255),
        },
        pid: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        praise_total: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_star: {
            type: DataTypes.INTEGER(1),
        },
        create_time: {
            type: DataTypes.TIME,
        }
    }, {
        tableName: 'szj_users_comment'
    });
    Model.associate = function() {
        //关联用户表
        Model.belongsTo(app.model.Users,{foreignKey:'user_id',targetKey:'user_id',as:'users'});
    }
    return Model;
};
