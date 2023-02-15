const con = require('../config')
const User = require('../models/user')
const Staff = require('../models/staff')

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = con.JWT_SECRET;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

//staff
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id)
        const staff = await Staff.findById(jwt_payload.id)

        if (!staff) {
          return done(new Error('Staff not found'), null)
        }
  
        return done(null, staff)
      } catch (error) {
        done(error)
      }
    })
  )

module.exports.isLogin = passport.authenticate('jwt', { session: false })