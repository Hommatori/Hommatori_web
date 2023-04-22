import Head from 'next/head'
import Link from 'next/link'

export default function Login() {
    function login() {
        const username = 'testi@4ksagl';
        const password = 'Makkara1';
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
          },
          credentials: 'include', // Add this line
        })
        .then((response) => console.log(response))
        .then((data) => {
          console.log("data: " + data)
        });
      };

    function logout() {
        fetch('/api/logout', {
            method: 'POST',
        })
    }
  

    return (
        <div>
            <br/><br/><br/><br/><br/><br/>
            <button onClick={() => login()}>Login</button>
            <br/><br/><br/><br/><br/><br/>
            <button onClick={() => logout()}>Log out</button>
        </div>
    )
}