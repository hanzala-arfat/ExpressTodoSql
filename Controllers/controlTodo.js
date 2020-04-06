const express = require("express");
const db = require("../Db/db");

exports.isuerLogin = function(req, res, next) {
  console.log("middleware userid", req.body.userid);
  console.log("middleware id", req.body.userid);

  db.execute(`SELECT islogin FROM Users WHERE islogin = 'true'`)
    .then(loged => {
      console.log("Middleware part after success", loged[0][0].islogin);
      next();
    })
    .catch(err => {
      console.log("errr from middleware");
      if (req.originalUrl === "/user-login") {
        res.render("login.ejs");
      }
      if (req.originalUrl === "/") {
        res.render("register.ejs");
      }
      next();
    });
};

// exports.isuerLogin = async function(req, res, next) {
//   try {
//     const loged = await db.execute(
//       `SELECT islogin FROM Users WHERE islogin = 'true'`
//     );
//     console.log("Middleware part after success", loged[0][0].islogin);
//     next();
//   } catch (err) {
//     console.log("errr from middleware");
//     if (req.originalUrl === "/user-login") {
//       res.render("login.ejs");
//     }
//     if (req.originalUrl === "/") {
//       res.render("register.ejs");
//     }
//     next();
//   }
// };

exports.getAllTodo = (req, res) => {
  console.log("isuser login ", req.islogin);
  //indec ejs file me todo data ko pass kiya gya h
  var userid = req.params.userid;
  userid = userid.slice(1); // isme : colon araha tha usi koremove kiya gya h
  console.log("userid is", userid);

  if (userid) {
    db.execute(`SELECT * FROM TodoData  WHERE fuserId = ?`, [userid])
      .then(([rows, fieldData]) => {
        // .then(data => {
        // console.log("all get user data...", rows); //sabhi data ko print karega
        res.render("index.ejs", { todoData: rows });
      })
      .catch(err => {
        if (err.errno == 1146) {
          console.log("err is...", err);
          res.render("index.ejs", { todoData: 0 });
        }
      });
  } else {
    console.log("else parts");
    res.render("index.ejs", { todoData: 0 });
  }
};

exports.AddToDo = (req, res) => {
  res.render("addTodo.ejs");
};

exports.AddTodoDataPost = (req, res) => {
  const title = req.body.title;
  const data = req.body.data;
  const userid = req.body.userid;
  check_and_add_new_data(title, data, userid);
  if (userid) {
    res.send("successfull added");
  }
};

exports.EditToDoGet = (req, res) => {
  console.log("get edit part id ..", req.params.id);
  const get_tod_and_userid = req.params.id.split(",");

  const userid = get_tod_and_userid[0];
  const todoid = get_tod_and_userid[1];

  db.execute(
    `SELECT * FROM TodoData WHERE todo_id = "${todoid}" AND fuserId = "${userid}"`
  )
    .then(data => {
      console.log(data[0][0]);
      // res.send(data[0][0]);
      res.render("edit.ejs", { singletodo: data[0][0] });
    })
    .catch(err => {
      console.log(err);
    });

  // const singletodo = todoData.filter(todo => todo.id == id)[0];
  //console.log("get pass id", id, singletodo.id);
};

exports.EditToDoPost = (req, res) => {
  //i = req.data.index;
  // Edit karne k baad post kiya gya data
  console.log("jquery id", req.body.todoid);
  const todoid = req.body.todoid;
  const userid = req.body.userid;
  const title = req.body.title;
  const data = req.body.data;

  // db.execute(
  //   `UPDATE TodoData SET title = "${title}", data = "${data}" WHERE todo_id = ?`,
  //   [todoid]
  // )
  db.execute(
    `UPDATE TodoData SET title = "${title}", data = "${data}" WHERE todo_id = "${todoid}" AND fuserId = "${userid}"`,
    [todoid]
  )
    .then(() => {
      console.log("Successfull Updated data", todoid);
      res.send({ userid, todoid });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.DeleteToDo = (req, res) => {
  const get_tod_and_userid = req.params.id.split(",");
  const userid = get_tod_and_userid[0];
  const todoid = get_tod_and_userid[1];
  db.execute(
    `DELETE  FROM todoDb.TodoData WHERE todo_id = "${todoid}" And fuserId = "${userid}"`
  )
    .then(() => {
      console.log("Suceesfully detet data id", id);
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};

function check_and_add_new_data(title, data, fuserId) {
  db.execute("INSERT INTO TodoData (title, data, fuserId) VALUES(?,?,?)", [
    title,
    data,
    fuserId
  ])
    .then(() => {
      console.log(" data inserted  successfull");
    })
    .catch(err => {
      //1146 code denotes table is exist ager table nhi rahega to table create hoga
      if (err.errno == 1146) {
        db.execute(
          `CREATE TABLE IF NOT EXISTS todoDb.TodoData(
                      todo_id INT NOT NULL AUTO_INCREMENT ,
                      title VARCHAR(255) NOT NULL,
                      data VARCHAR(255) NOT NULL, 
                      fuserId INT NOT NULL,
                      PRIMARY KEY (todo_id),
                      FOREIGN KEY(fuserId) REFERENCES Users(user_id))`
        ).then(() => {
          console.log("Table is successfully Created");
          check_and_add_new_data(title, data, fuserId);
        });
      }
    });
}

// ('select count(u.id) from User u, Todo t where t.date = "15-02-2020" and t.user_id = u.id');

// db.execute(
//   "CREATE TABLE IF NOT EXISTS todoDb.Users (todo_id INT , userName VARCHAR(255), pass VARCHAR(255))"
// )
//   .then(() => {
//     //adb.execute('SELECT todoDB.users')
//     console.log("Table is successfully Created");
//   })
//   .catch(err => {
//     console.log(err);
//   });

exports.todo;
