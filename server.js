const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const { handleRegister } = require('./controllers/register');
const knex = require('knex');
const { handleSigin } = require('./controllers/signin');
const { handleImage, handleApiCall } = require('./controllers/image');
const { handleProfile } = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
        host: 'dpg-cg6dl3o2qv28u2p7jm9g-a',
        port: 5432,
        user: 'rajkumarguggilla',
        password: '',
        database: 'smartface'
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


app.get('/', (req, res) => res.status(200).json('welcome to smart-face'))

app.post('/signin',handleSigin(db,bcrypt))

app.post('/register',handleRegister(db,bcrypt))

app.get('/profile/:id', (req, res) => handleProfile(req,res,db))

app.put('/image', (req, res) =>handleImage(req,res,db))

app.post('/imageurl',(req,res)=>handleApiCall(req,res))




app.listen(3000, () => {
    console.log("running on port 3000")
})


/* 
********PLANNING API*****

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:usrID --> GET = user
/image --> PUT = user
*/