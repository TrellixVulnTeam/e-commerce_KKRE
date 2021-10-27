const Account = require('../Models/Account')
const createHmac = require('create-hmac')
const jwt = require('jsonwebtoken')

class AccountController {
    getLogin(req, res) {
        res.render('auth/login')
    }

    verify(req, res) {
        const username = req.body.username
        const password = req.body.password
        Account.findOne({ username }, {
            role: 1,
            password: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1
        }, (err, acc) => {
            if (err) return res.status(401)
            if (!acc) return res.json({ message: 'username' })
            const hmac = createHmac('sha256', Buffer.from(process.env.HASH_KEY))
            hmac.update(password)
            let hashPass = hmac.digest("hex")
            if (acc.password != hashPass) {
                res.json({ message: 'password' })
            } else {
                const token = jwt.sign({ _id: acc._id }, process.env.JWT_TOKEN_SECRET)
                return res.json({
                    message: 'success',
                    role: acc.role,
                    firstName: acc.firstName,
                    lastName: acc.lastName,
                    avatar: acc.avatar,
                    token: token
                })
            }
        })
    }
}

module.exports = new AccountController
