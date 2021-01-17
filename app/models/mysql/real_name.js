/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const Model = app.model.define('RealName', {
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(100),
        },
        head_image: {
            type: DataTypes.STRING(255),
        },
        company_name: {
            type: DataTypes.STRING(255),
        },
        user_level: {
            type: DataTypes.INTEGER(1).UNSIGNED,
        },
        user_desc: {
            type: DataTypes.STRING(255),
        },
        is_real: {
            type: DataTypes.INTEGER(1).UNSIGNED,
        },
        exp_value: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        update_time: {
            type: DataTypes.TIME,
        },
        create_time: {
            type: DataTypes.DATE,
        },
        user_position:{
            type:DataTypes.STRING(50),
        },
        user_phone:{
            type:DataTypes.STRING(50),
        },
        user_tel:{
            type:DataTypes.STRING(50),
        },
        user_fax:{
            type:DataTypes.STRING(50),
        },
        user_email:{
            type:DataTypes.STRING(50),
        },
        user_web:{
            type:DataTypes.STRING(50),
        },
        user_address:{
            type:DataTypes.STRING(50),
        },
        user_postcode:{
            type:DataTypes.STRING(50),
        },
        user_product:{
            type:DataTypes.STRING(50),
        },
        user_other:{
            type:DataTypes.STRING(50),
        },
    }, {
        tableName: 'szj_real_name'
    });

    Model.associate = function() {
        //关联用户表
        Model.belongsTo(app.model.Users,{foreignKey:'user_id',targetKey:'user_id',as:'users'});
    }
    return Model;
};
