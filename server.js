const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')


const app = express();

app.use(express.json())
app.use(cors())


const database = {
    users: [
        {
            id: '123',
            name: 'raj',
            email: 'raj@gmail.com',
            password: 'pass',
            entries: 0,
            joined: new Date()
        },
        {
            id: '456',
            name: 'kumar',
            email: 'kumar@gmail.com',
            password: 'pass2',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.json(database.users)
})

app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.status(200).json(database.users[0])
    }
    else {
        res.status(401).json('error in logging')
    }
})

app.post('/register', (req, res) => {

    const { name, email, password } = req.body

  
    database.users.push({
        id: '789',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.status(200).json(database.users[database.users.length - 1]);

})

app.get('/profile/:id', (req, res) => {

    const id = req.params.id

    let found = false

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true
            return res.status(200).json(user)
        }
    })

    if (!found) res.status(404).json('user not found')

})

app.put('/image', (req, res) => {

    const id = req.body.id

    let found = false

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true
            user.entries++
            return res.status(200).json(user.entries)
        }
    })

    if (!found) res.status(404).json('user not found')


})






app.listen(3000, () => {
    console.log("running on port 3000")
})



// bcrypt.hash(password, null, null, function (err, hash) {
        
// });


//     // Load hash from your password DB.
//     bcrypt.compare("bacon", hash, function (err, res) {
//         // res == true
//     });
//     bcrypt.compare("veggies", hash, function (err, res) {
//         // res = false
//     })
    
    
//   process.once('SIGUSR2', function () {
//     gracefulShutdown(function () {
//       process.kill(process.pid, 'SIGUSR2');
//     });
//   });



/* 
********PLANNING API*****

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:usrID --> GET = user
/image --> PUT = user
*/