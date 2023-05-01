export default (req, res) => {
    const { accessToken, userData } = req.cookies
  
    if (accessToken && userData) {
      res.status(200).json({ token: accessToken, authenticated: true })
    } else {
      res.status(200).json({ authenticated: false })
    }
  }