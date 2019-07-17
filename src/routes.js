// user
const USERS = "/users";
const SIGNUP = "/signup";
const LOGIN = "/login";
const LOGOUT = "/logout";
const USERROOMS = "/list";
const SCHEDULES = "/schedules";

// room
const ROOMS = "/rooms";
const CREATEROOM = "/create";
const MEMBER = "/member";

// schedule
// const SCHEDULES = "/schedules";    // 이름 주의!

// kakao

// github

const routes = {
  users: USERS,
  signup: SIGNUP,
  login: LOGIN,
  logout: LOGOUT,
  userRooms: USERROOMS,
  schedules: SCHEDULES,
  rooms: ROOMS,
  createRoom: CREATEROOM,
  member: MEMBER
};

export default routes;
