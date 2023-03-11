const handleRegister = (db,bcrypt) => (req,res) => {

    const { name, email, password } = req.body

    if(!name || !email || !password) return res.status(400).json('provide valid info')

    const hash = bcrypt.hashSync(password);

    // database.users.push({
    //     id: '789',
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date()
    // })

    // res.status(200).json(database.users[database.users.length - 1]);

    db.transaction(trx => {

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
        .catch(err => {
            res.status(400).json("unable to register")
        })

}

module.exports  = {
    handleRegister
}