const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 8000;
//สำหรับเก็บ users
let users = [];
let counter = 1;

let conn = null

const initMysql = async () => {
     conn=await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
      })
}

 /*
 // path = /test
app.get('/test', (req, res) => {
    let user = {
        firstname: 'John',
        lastname: 'Doe',
        age : 25
    }
    res.json(user);
})
*/

// path = get /users เส้นที่ 1
app.get('/users', async (req,res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0]);
})
// path = post /users เส้นที่ 2
app.post('/users',async (req, res) => {
    try{
    let user = req.body
    const results = await conn.query('INSERT INTO users SET ?', user)
    res.json({
        message:'Create new user successfully',
        data:results[0]
    })
    } catch (error) {
        console.log('errorMessage: error.message',error.message)
        res.status(500).json({
            message:'something went wrong',
            
        })
    }
    
    
   
    })
    

// path = get /users ดึงข้อมูล users ตาม id เส้นที่ 3
app.get('/users/:id',async (req,res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('Select * FROM users WHERE id = ?',id )
        
        if(results[0].length == 0){
            throw { statusCode:404 ,message:'User not found'}
            
        }
            res.json(results[0][0])
            
        
    } catch (error){
        console.log('errorMessage',error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message:'something went wrong',
            errorMessage: error.message
        })
    }
    
})



// path = put /user/:id เส้นที่ 4
app.put('/users/:id', async (req,res) => {
    
    try{
    let id = req.params.id;
    let updateUser = req.body;
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser,id])
        res.json({
            message:'Update user successfully',
            data:results[0]
        })
        } catch (error) {
            console.log('errorMessage',error.message)
            res.status(500).json({
                message:'something went wrong',
                
            })
        }


    

    
    
})

// path = delete /user/:id เส้นที่ 5
app.delete('/users/:id', async (req,res) => {
    try{
        let id = req.params.id;
         const results = await conn.query('DELETE FROM users WHERE id = ?', id)
        res.json({
        message:'Delete user successfully',
        data:results[0]
         })
        } catch (error) {
            console.log('errorMessage',error.message)
            res.status(500).json({
            message:'something went wrong',
                    
         })
        }
    
    
   
    
})
app.listen(port, async (req,res) => {
    await initMysql()
  console.log('http server is running on',+ port);
})