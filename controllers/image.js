const { response } = require("express");

const handleApiCall = (req, res) => {


    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '7e7f65687c224928bc6fbfac9006e18d';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = '2g3xwbmf4u7b';
    const APP_ID = 'my-first-application';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';
    const IMAGE_URL = req.body.input;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => res.status(200).json(result))
        .catch(error => {
            res.status(400).json('problem in detection , try again later');
            console.log('error', error)
        });

}


const handleImage = (req, res, db) => {

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

    db('users')
        .where({ id })
        .increment({ entries: 1 })
        .returning("entries")
        .then(entries => res.status(200).json(entries[0].entries))
        .catch(err => res.status(400).json("error in getting data "))

}

module.exports = { handleImage, handleApiCall }