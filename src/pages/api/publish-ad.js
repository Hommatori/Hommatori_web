import 'isomorphic-fetch'
import FormData from 'isomorphic-form-data'
import fetch from 'node-fetch'
import formidable from 'formidable'
import fs from 'fs'

async function publish(req, res) {
  const { accessToken, userData } = req.cookies

  if (!accessToken || !userData) {
    res.status(401).send('Unauthorized')
    return
  }

  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: 'Error parsing form data' })
      return
    }

    console.log("FILES: " + JSON.stringify(files))
    console.log("FILES: " + JSON.stringify(fields))

    try {
        const nodeJsApiUrl = `${process.env.NODEJS_URL}/ad`

        console.log("API URL: " + nodeJsApiUrl)

        // Create a new FormData instance
        const formData = new FormData()

        // Append all form fields
        Object.keys(fields).forEach((key) => {
            formData.append(key, fields[key])
        })

        // Append all files
        Object.keys(files).forEach((key) => {
            const file = files[key]
            formData.append('images', fs.createReadStream(file.path), file.name)
        })
        
    console.log("FORSM DATA: " + formData)    
    console.log("FORSM DATA 2222: " + JSON.stringify(formData))

        const http = require('http');
        const forwardResponse = await fetch(nodeJsApiUrl, {
        method: 'POST',
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
        body: formData,
        agent: new http.Agent({ keepAlive: true, timeout: 60000 })
        });

        if (!forwardResponse.ok) {
            throw new Error('HTTP error! Status: ' + forwardResponse.status)
        }

        const data = await forwardResponse.json()
        console.log(data)
        res.status(200).json(data)

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'An error occurred while forwarding the request' })
        }
  })
}

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default publish