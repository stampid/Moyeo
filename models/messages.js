module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "messages",
    {
      messageContent: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: true, // 타임스탬프 사용여부
      underscored: true, // snake case(true) / camle case(false) 권장 여부
      paranoid: true // 삭제일
    }
  );
};

// 연결로 필요한
