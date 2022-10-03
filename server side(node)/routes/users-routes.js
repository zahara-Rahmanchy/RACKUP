const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const auth = admin.auth();

router.get('/:uid', (req, res, next) => {
    // const { uid } = '5WieDmKAlDWm2I5BJaIutWA2SvJ2';
    const { uid } = req.params;
    auth
    .deleteUser(uid)
    .then(() => {
        // See the UserRecord reference doc for the contents of userRecord.
        // console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
        res.json('Deleted!');
        next();
    })
    .catch((error) => {
        console.log('Error fetching user data:', error);
    });
})

module.exports = router;