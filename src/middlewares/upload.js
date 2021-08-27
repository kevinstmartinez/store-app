import path from 'path'
import multer from 'multer'

const storage = multer.diskStorage({
  // destination: './src/images/',
  filename:(req, file, cb) =>{
    return cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage
})

module.exports = upload

