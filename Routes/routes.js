const express = require("express");
const router = express.Router();
const path = require("path");
const TodoControllr = require("../Controllers/controlTodo");
const UserControllr = require("../Controllers/userlogin");

router.use(TodoControllr.isuerLogin);
router.get("/user-data/:userid", TodoControllr.getAllTodo);

//router.get("/add-todo", TodoControllr.AddToDo);
router.get("/add-todo/:id", TodoControllr.AddToDo);
router.post("/todo-data-post/:userid", TodoControllr.AddTodoDataPost);

router.post("/edit-todo", TodoControllr.EditToDoPost);
router.get("/edit-todo/:id", TodoControllr.EditToDoGet);

router.get("/delete-todo/:id", TodoControllr.DeleteToDo);
router.get("/", UserControllr.RegisterPage);
router.post("/add-user", UserControllr.AddUserPost);
router.get("/login-user", UserControllr.LoginUser);
router.post("/login-user/:user", UserControllr.LoginUserPost);
router.post("/logOutUser/:user", UserControllr.logOutUser);

// isko hamesa last me hi write karenge ye tab run hoga jab route kisi ka bhi match nhi karega toh
router.get("*", (req, res) => {
  res.send("Page Not Found ... 404 ");
});
module.exports = router;
