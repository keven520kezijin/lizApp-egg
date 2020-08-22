/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;
    const Model = app.model.define('VideoTag', {
        vt_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        video_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        tag_name: {
            type: DataTypes.STRING(100),
        },
        create_time: {
            type: DataTypes.TIME
        }
    }, {
        tableName: 'szj_video_tag'
    });
    Model.associate = function() {

    }
    return Model;
};
