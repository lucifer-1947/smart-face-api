const handleProfile = (req, res, db) => {

    const id = req.params.id

    // let found = false
    // database.users.forEach((user) => {
    //     if (user.id === id) {
    //         found = true
    //         return res.status(200).json(user[0])
    //     }
    // })
    // if (!found) res.status(404).json('user not found')


    db
        .select('*')
        .from('users')
        .where({ id })
        .then(response => {
            if (response.length) res.status(200).json(response[0])
            else res.status(400).json('sorry user not found')
        })
        .catch(err => res.status(400).json('error in getting user'))


}

module.exports = { handleProfile }