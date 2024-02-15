const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('./database');
const randomstring = require('randomstring');


const app = express();

app.use(router);

const createUser = async (req, res) => {
    const { email_id, password, user_name, type } = req.body;
  
    if (!email_id || !password) {
      res.status(400).send({
        message: "Invalid request",
      });
    }
    const queryString = `INSERT INTO Users (email_id, password, user_name, type)values ( ?, ?, ?, ?)`;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const [results] = await connection
      .promise()
      .execute(queryString, [email_id, hashedPassword, user_name, type]);
  
    res.status(201).send({
      message: "Users added successfully",
      results,
    });
  };

  const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.params) {
        res.status(400).send({
          message: "Invalid request",
        });
      }
      let queryString = `SELECT user_name, type from Users where user_id = ?`;
      const [result] = await connection.promise().execute(queryString, [id]);
  
      if (result.length === 0) {
        res.status(404).send({
          message: "User not found",
        });
      }
      res.status(200).send({
        message: "Successfully user received",
        result,
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal server error",
        error,
      });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).send({
          message: "Invalid request: ID is missing",
        });
      }
  
      const queryString = "UPDATE Users SET is_active = 0 WHERE user_id = ?";
      const [result] = await connection.promise().execute(queryString, [id]);
  
      const responseBody = {
        message: "Successfully deleted user",
        list: result
      };
      res.status(200).send(responseBody);
    } catch (error) {
  
      res.status(500).send({ message: "Internal Server Error" });
    }
  };

  const getUsers = async (req, res) => {
    try {
      const { limit, offset } = req.query;
     if(!limit){
        res.send({
            message: "Invalid request"
        })
     }
      const queryString = "SELECT user_name, type from Users ORDER BY email_id LIMIT ? OFFSET ?";
      const [results] = await connection.promise().execute(queryString, [limit, offset]);

      const countQueryString = "SELECT COUNT(*) as count FROM Users";
      const [countResults] = await connection.promise().execute(countQueryString);
  
      const responseBody = {
        message: "Users list",
        list: results,
        count: countResults[0].count,
      };
  
      res.status(200).send(responseBody);
  
    } catch (err) {
    
      res.status(500).send({ message: "Internal Server Error" });
    }
};

const userLogin = async (req, res) => {
    try {
      const { email_id, password } = req.body;
  
      if (!email_id || !password) {
        res.status(400).send({
          message: "Email and Password Required",
        });
      }
      let queryString = `SELECT user_name, type, password FROM Users WHERE email_id = ?`;
      const [result] = await connection.promise().execute(queryString, [email_id]);

      const dbPassword = result[0].password;

      const isCorrectPassword = await bcrypt.compare(password, dbPassword);
      
      if (!isCorrectPassword) {
        res.status(400).send({ message: "Password is incorrect" });
      }
  
      const token = jwt.sign({ user_id: result[0].id }, 'monkeydluffy');
     
      res.status(200).send({
        message: "Logged In Successfully",
        token
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal server error",
        error,
      });
    }
  };


  const authMiddleware = (req, res, next) => {
    if (req.headers && req.headers.token) {
      try {
        const token = req.headers.token;
        const decodedToken = jwt.verify(token, 'monkeydluffy')
        console.log(decodedToken);
      } catch (err) {
        console.log({err})
        res.status(400).send({
          message: "Invalid Token"
        })
      }
      next()
      return;
    }
  
    res.status(400).send({
      message: "Token Required"
    })
  }


  const generateOTP = async (req, res) => {
  
 
    try {
      const { email_id } = req.body;
      if (!email_id) {
        res.status(400).send({
          message: "Email Required",
        });
      }
  
  
      function generateOTP() {
        return randomstring.generate({
            length: 4,
            charset: 'numeric'
        });
      }
    const otp = generateOTP();
  
      let otpString = `INSERT INTO otp (email_id, otp_code) VALUES (?, ?)`;
      const [result] = await connection.promise().execute(otpString, [email_id, otp]);
  
      res.status(200).send({
        message: "Otp Generated Successfully",
        result
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error,
      });
    }
  };
//Users API
router.get("/users", authMiddleware, getUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.post("/users", createUser);
router.delete("/users/:id", authMiddleware, deleteUser);

//Login API
router.post("/login", userLogin);

//ForgetPassword API
router.post("/fpassword", authMiddleware, generateOTP);

module.exports = router;