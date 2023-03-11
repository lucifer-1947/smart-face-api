const handleSigin = (db,bcrypt) => (req,res)=>{

    const { email, password } = req.body;

    // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    //     res.status(200).json(database.users[0])
    // }
    // else {
    //     res.status(401).json('error in logging')
    // }

    db('login')
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
                return db
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
}

module.exports = {handleSigin}