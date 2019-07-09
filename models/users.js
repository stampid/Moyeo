module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      region: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      timestamps: false, // 타임스탬프 사용여부
      underscored: true, // snake case(true) / camle case(false) 권장 여부
      paranoid: true // 삭제일
    }
  );
};

// 연결로 필요한
