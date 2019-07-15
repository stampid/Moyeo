module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "UserSchedule",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      scheduleId: {
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
