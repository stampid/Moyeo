import { User, Room, UserRoom } from "../../models/index";

export const createRoom = (req, res) => {
  const { roomTitle, roomSize, region, category, poleId, userId } = req.body;
  console.log(roomTitle, roomSize, region, category, poleId, userId);

  Room.create({
    roomTitle,
    roomSize,
    region,
    category,
    poleId,
    permissionId: userId
  })
    .then(data => {
      UserRoom.create({
        roomId: data.id,
        userId
      }).then(roomuser => {
        console.log(roomuser);
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const entryRoom = (req, res) => {
  UserRoom.create({});
};
