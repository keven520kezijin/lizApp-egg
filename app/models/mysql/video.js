/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('Video', {
        video_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        video_name: {
            type: DataTypes.STRING(255),
        },
        video_hash: {
            type: DataTypes.STRING(255),
        },
        video_alias: {
            type: DataTypes.STRING(255),
        },
        video_desc: {
            type: DataTypes.STRING(255),
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_url: {
            type: DataTypes.STRING(255),
        },
        video_duration: {
            type: DataTypes.STRING(10),
        },
        video_price: {
            type: DataTypes.FLOAT,
        },
        video_views: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_praise: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_share: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        video_status: {
            type: DataTypes.INTEGER(1).UNSIGNED,
        },
        video_image: {
            type: DataTypes.STRING(255),
        },
        admin_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        update_time: {
            type: DataTypes.TIME
        },
        create_time: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'szj_video'
    });
    Model.associate = function() {
        //关联视频标签表
        Model.belongsTo(app.model.VideoTag,{foreignKey:'video_id',targetKey:'video_id',as:'video_tag'});
        //关联用户
        Model.belongsTo(app.model.Users,{foreignKey:'user_id',targetKey:'user_id',as:'users'});
    }
    return Model;
};
