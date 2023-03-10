const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'rajkumarguggilla',
        password: '',
        database: 'smart-face'
    }
});

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'raj',
//             email: 'raj@gmail.com',
//             password: 'pass',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '456',
//             name: 'kumar',
//             email: 'kumar@gmail.com',
//             password: 'pass2',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }


const app = express();
app.use(express.json())
app.use(cors())




app.get('/', (req, res) => {
    res.status(200).json('welcome to smart-face')
})

app.post('/signin', (req, res) => {

    const { email, password } = req.body;

    // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    //     res.status(200).json(database.users[0])
    // }
    // else {
    //     res.status(401).json('error in logging')
    // }

    knex('login')
        .where({
            email: email
        })
        .select('*')
        .then(data => {

            if (data.length) return bcrypt.compareSync(password, data[0].hash)
            else throw new Error("wrong info")

        })
        .then(isValid => {
            if (isValid) {
                return knex
                    .select('*')
                    .from('users')
                    .where({ email: email })
            }
            else {
                throw  new Error('wrong info')
            }
        })
        .then(user=>res.status(200).json(user[0]))
        .catch(err => {
            res.status(400).json("err in signing ")
        })
})

app.post('/register', (req, res) => {

    const { name, email, password } = req.body

    const hash = bcrypt.hashSync(password);

    // database.users.push({
    //     id: '789',
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date()
    // })

    // res.status(200).json(database.users[database.users.length - 1]);

    knex.transaction(trx => {

        return trx
            .insert({
                'hash': hash,
                'email': email
            })
            .into('login')
            .returning("email")
            .then(loginEmail => {

                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: email,
                        joined: new Date()
                    })
            })
    })
        .then(response => {

            res.status(200).json(response[0])

        })
        .catch(err => res.status(400).json("unable to register"))

})

app.get('/profile/:id', (req, res) => {

    const id = req.params.id

    // let found = false
    // database.users.forEach((user) => {
    //     if (user.id === id) {
    //         found = true
    //         return res.status(200).json(user[0])
    //     }
    // })
    // if (!found) res.status(404).json('user not found')


    knex
        .select('*')
        .from('users')
        .where({ id })
        .then(response => {
            if (response.length) res.status(200).json(response[0])
            else res.status(400).json('sorry user not found')
        })
        .catch(err => res.status(400).json('error in getting user'))


})

app.put('/image', (req, res) => {

    const id = req.body.id

    // let found = false

    // database.users.forEach((user) => {
    //     if (user.id === id) {
    //         found = true
    //         user.entries++
    //         return res.status(200).json(user.entries)
    //     }
    // })

    // if (!found) res.status(404).json('user not found')

    knex('users')
        .where({ id })
        .increment({ entries: 1 })
        .returning("entries")
        .then(entries => res.status(200).json(entries[0].entries))
        .catch(err => res.status(400).json("error in getting data "))

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


process.once('SIGUSR2', function () {
    gracefulShutdown(function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});



/* 
********PLANNING API*****

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:usrID --> GET = user
/image --> PUT = user
*/