import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import pool from '../database'

const verifyToken = async (req, res, next) => {
  let auth = req.headers.authorization

  if (!auth) return res.status(403).json({ message: 'No token provided' })

  let token = null
  if (auth && auth.toLowerCase().startsWith('bearer'))
    token = auth.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.id_store = decoded.id
    const store = await pool.query('SELECT * FROM store WHERE id=?', [
      req.id_store,
    ])
    if (!store) return res.status(404).json({ message: 'Not user found' })

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const store = await pool.query('SELECT * FROM store WHERE id=?', [
      req.id_store,
    ])
    const roles = await pool.query('SELECT * FROM role WHERE id=?', [
      store[0].id_role,
    ])

    console.log(roles)
    roles.filter((index) =>
      index.role === 'admin'
        ? next()
        : res.status(403).json({ message: 'Require Admin role' })
    )
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error })
  }
}
const isSeller = async (req, res, next) => {
  try {
    const store = await pool.query('SELECT * FROM store WHERE id=?', [
      req.id_store,
    ])
    const roles = await pool.query('SELECT * FROM role WHERE id=?', [
      store[0].id_role
    ])
    console.log(store)
    console.log(roles)
    roles.filter((index) =>
      index.name === 'seller'
        ? next()
        : res.status(403).json({ message: 'Require Seller role' })
    )
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error })
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  isSeller
}
