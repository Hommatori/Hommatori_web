import jwt from 'jsonwebtoken'
import { decryptData } from '../../components/crypto.js'

async function login(req, res) {
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization
      },
      body: JSON.stringify(req.body),
      credentials: 'include'
    })

    if (response.ok) {
      const setCookieHeader = response.headers.get('set-cookie')
      const accessToken = setCookieHeader.split('=')[1].split(';')[0]

      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      console.log(decodedToken)
      const encryptedUserData = decodedToken.token
      console.log( "123: " + encryptedUserData)
      const userData = decryptData(encryptedUserData)

      const accessTokenCookie = `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60 * 1000}`
      const userDataCookie = `userData=${userData}; Path=/; Max-Age=${24 * 60 * 60 * 1000}`

      res.setHeader('Set-Cookie', [accessTokenCookie, userDataCookie])
      res.status(200).json('logged in')
    } else {
      res.status(401).send('Unauthorized')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while logging in' })
  }
}

export default login