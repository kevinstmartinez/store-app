import pool from '../database'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = (req, res) => {
  const { name, last_name, username, password, phone, address, store_name, role } = req.body
  let roles = req.body.role

  pool.query('SELECT username, phone, store_name FROM store WHERE username=? OR phone=? OR store_name=?', [username, phone, store_name], async (error, results) => {
    if (results.length > 0) return res.status(400).json({ message: 'That store is already in use, please validate the info.' })

    if (roles) {
      const foundRole = await pool.query('SELECT * FROM role WHERE name=?', [roles])
      roles = foundRole.map(role => role.id)

    } else {
      const role = await pool.query('SELECT * FROM role WHERE name=?', ['seller']);
      roles = role[0].id
    }
    let hashedPassword = await bcrypt.hash(password, 10)

    const newStore = {
      name,
      last_name,
      username,
      password: hashedPassword,
      phone,
      address,
      store_name,
      id_role: roles
    }

    await pool.query('INSERT INTO store set ?', [newStore])

    const token = jwt.sign({ id: newStore.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
    return res.status(200).json({ token })
  })
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("req", req.body);
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide an username and password",
      });
    }

    const stores = await pool.query("SELECT * FROM store WHERE username=?", [ username,
    ]);

    if (!stores[0]) res.status(400).json({ message: "Store Not Found" });

    const matchPassword = await bcrypt.compare(password, stores[0].password);

    if (!matchPassword)
      return res.status(401).json({ token: null, message: "Invalid password" });

    const token = jwt.sign(
      { id: stores[0].id, username: stores[0].username, store: stores[0].store_name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ name: stores[0].store_name, token });
  } catch (error) {
    console.log(error);
  }
}


module.exports = { register, login }