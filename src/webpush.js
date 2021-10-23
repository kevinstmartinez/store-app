import webpush from 'web-push'
const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
  'mailto:dmosqueram3@ucentral.edu.co',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
)


module.exports = webpush