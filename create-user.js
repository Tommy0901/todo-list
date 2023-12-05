const User = require("./models").User;
const Todo = require("./models").Todo;

const { name, email, password } = require("./public/jsons/user");

(async () => {
  await User.create({ name, email, password });
  const user = await User.findOne({ raw: true, where: { name } });
  await Todo.update({ userId: user.id }, { where: { userId: null } });
})();
