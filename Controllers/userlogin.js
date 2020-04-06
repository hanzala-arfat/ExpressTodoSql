const express = require("express");
const db = require("../Db/db");

exports.RegisterPage = (req, res) => {
  res.render("register.ejs");
};

exports.AddUserPost = (req, res) => {
  const userName = req.body.username;
  const password = req.body.pass;
  console.log("userNme is ", userName, "and password", password);
  check_and_add_new_user(userName, password);
  res.send("amir");
};

exports.LoginUser = (req, res) => {
  res.render("login.ejs");
};

exports.LoginUserPost = (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  console.log("user name is .. ", user, "password is..", pass);
  auth_check(user, pass, res, "true");
  // db.execute(
  //   `SELECT * FROM todoDb.Users  WHERE pass = "${pass}" AND userName = "${user}"`
  // )
  //   .then(result => {
  //     console.log("succes full", result[0][0].user_id);
  //     res.send({ user_id: result[0][0].user_id });
  //   })
  //   .catch(err => {
  //     console.log("err is login user post", err);
  // });
};

exports.logOutUser = (req, res) => {
  const userid = req.body.userid;
  const islogin = "false";
  console.log("userid is....logut", userid);
  db.execute(
    `UPDATE Users SET islogin ='${islogin}' WHERE user_id = "${userid}"`
  )
    .then(() => {
      res.render("login.ejs");
    })
    .catch(err => {
      throw err;
    });
};

function auth_check(user, pass, res, islogin) {
  db.execute(
    `SELECT * FROM todoDb.Users  WHERE pass = "${pass}" AND userName = "${user}"`
  )
    .then(result => {
      let userid = result[0][0].user_id;
      console.log("result.user_id", result.user_id);
      console.log("succes full match user and password", result[0][0].user_id);

      if (userid) {
        db.execute(
          `UPDATE Users SET islogin ='${islogin}' WHERE user_id = "${userid}"`
        )
          .then(() => {
            res.send({ user_id: result[0][0].user_id });
          })
          .catch(err => {
            throw err;
          });
      }
    })
    .catch(err => {
      console.log("wrong User_name or password");
      res.send(false);
    });
}

function check_and_add_new_user(userName, password) {
  let islogin = "false";
  db.execute("INSERT INTO Users (userName, pass, islogin) VALUES(?,?, ?)", [
    userName,
    password,
    islogin
  ])
    .then(res => {
      console.log(" data inserted  successfull");
      // console.log(res[0].insertId); ya insert kiye hue ki id batayega
    })
    .catch(err => {
      //1146 code denotes table is exist ager table nhi rahega to table create hoga
      if (err.errno == 1146) {
        db.execute(
          `CREATE TABLE IF NOT EXISTS todoDb.Users(
                      user_id INT NOT NULL AUTO_INCREMENT ,
                      userName VARCHAR(255) NOT NULL,
                      pass VARCHAR(255) NOT NULL,
                      islogin VARCHAR(20) NOT NULL,
                      PRIMARY KEY (user_id))`
        ).then(() => {
          console.log("Table is successfully Created");
          check_and_add_new_user(userName, password);
        });
      }
    });
}
