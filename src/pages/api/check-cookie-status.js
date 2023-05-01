// pages/api/checkAuth.js
export default (req, res) => {
  const { accessToken, userData } = req.cookies

  if (accessToken && userData) {
    res.status(200).json({ authenticated: true })
  } else {
    res.status(200).json({ authenticated: false })
  }
}