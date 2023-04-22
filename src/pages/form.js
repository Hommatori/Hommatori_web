import { useState, useEffect } from "react"
import styles from '../styles/form.module.css'
import { useRouter } from 'next/router'
import cookie from 'cookie';


export const getServerSideProps = async ({ req, res }) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userCookie = cookies['user'];
    const sessionCookie = cookies['session'];
    let data = null

    if (!userCookie) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return { props: {} };
    }
    
    const cookieHeader = `user=${userCookie}; session=${sessionCookie}`;
    const decodedUser = JSON.parse(decodeURIComponent(userCookie));
    try {
        const response = await fetch(`http://localhost:8080/userr/getprivatedata/${decodedUser.id}`, {
            headers: {
            Cookie: cookieHeader,
            },
        });

        if (!response.ok) {
            res.setHeader('location', '/login');
            res.statusCode = 302;
            res.end();
            return { props: {} };
        }
        data = await response.json();

        
    } catch (err) {

    }

    return {
        props: { data },
    };
};

export default function Form({ translations, id, jwt, response, data }) {
    const [userData, setUserData] = useState([])
    const router = useRouter()


    useEffect(() => { //automatically scrolls to the top of the page, useful for mobile users
      window.scrollTo(0, 0)
    }, []);
  
    if(jwt != null){
    decodedToken = jwt_decode(jwt);
    loggedInName = decodedToken.user.name;
    }

    const handleChange = input => e => {   //Handle fields change
      //this.setUserData({ [input]: e.target.value });
      userData[input] = e.target.value;
    }

    const handleImageChange = (e) => {
      userData.image = e.target.files[0];
    }

    const handleDelete = async (e) => {
      await axios.delete(Constants.API_ADDRESS + '/meal/' + id,
      {
        headers: {
          'Authorization': 'Bearer ' + jwt
      }
      });
      router.push("/business");
    }

    const handleCancel = async => {
        router.push("/business");
    }
    
    useEffect(() => {          

      const loadProfileDataWithJWT = async () => { //load user data to show here
        try {

          const results = await axios.get(Constants.API_ADDRESS + '/meal/byid/' +  id,
          {
              headers: {
                  'Authorization': 'Bearer ' + jwt
              }
          })
          if (results.data && results.data.length > 0)
          {
            results.data[0].image = null;
          setUserData(results.data[0]);
          
          }
        } catch(error) {
            console.log("something went wrong");
        }
      }    
        if(id !== "new")
      {

      loadProfileDataWithJWT();
    }
    else{
      console.log("new");
    }
    }, [jwt]);

    const handleSubmit = async (event) => {
      event.preventDefault();

      if(!userData.idfood)
      {
        userData.idrestaurant = decodedToken.user.id;
      }
      try {
        var result = await axios.post(Constants.API_ADDRESS + "/meal",
        {
          idfood: userData.idfood,
          name: userData.name,
          category: userData.category,
          description: userData.description,
          price: userData.price,
          idrestaurant: userData.idrestaurant
        });
        if(!userData.idfood)
        {
          userData.idfood = result.data.idfood;
        }
        console.log("image");
        if(userData.image)
        {
          console.log("Update image");
          const data = new FormData();
          data.append('file', userData.image);
          data.append('idfood', userData.idfood);
          var result = await axios.put(Constants.API_ADDRESS + "/meal/imageupload",
            data
          );
        }
        alert('Tallennettu!');
        navigation("/business");
      }

        catch(error){
          alert('Tallennus epäonnistui');
        }
    }

    
  return (
    <div className={styles.main}>
        <div className={styles.editContent}>
        <div className={styles.editTitle}>Edit your food: </div>
        <div className={styles.editSubTitle}>Click save to save the changes, cancel to take you back and trashcan to delete the food.</div>

        <form className={styles.editForm} onSubmit={ handleSubmit }>
                
                <div className="editMenuTitle">Name:</div>
                <input
                    type="text"
                    className={styles.editField}
                    name="name"
                    placeholder="name"
                    onChange={handleChange('name')}
                    defaultValue={userData.name}
                    autoComplete="off"
                    maxLength="50"
                    required
                />

            <h1>Protected Page</h1>
                <div>{JSON.stringify(data)}</div>

                <div className="editMenuTitle">Description:</div>
                <input
                    type="text"
                    className={styles.editFieldDesc}
                    name="description"
                    placeholder="description"
                    onChange={handleChange('description')}
                    defaultValue={userData.description}
                    autoComplete="off"
                    maxLength="255"
                    required
                />
                <div className="editMenuTitle">Category:</div>
                <input
                    type="text"
                    className={styles.editField}
                    name="category"
                    placeholder="category"
                    onChange={handleChange('category')}
                    defaultValue={userData.category}
                    autoComplete="off"
                    maxLength="50"
                    required
                />
                <div className="editMenuTitle">Price:</div>
                <input
                    type="text"
                    className={styles.editField}
                    name="price"
                    placeholder="price"
                    onChange={handleChange('price')}
                    defaultValue={userData.price}
                    autoComplete="off"
		pattern="[0-9\.]+"
		title="Only digits and ."
                    maxLength="10"
                    required
                />
                <div className={styles.editMenuTitle}>Image: (.jpg/.jpeg/.png only!)</div>
                <input
                    type="file"
                    className={styles.editField}
                    name="image"
                    placeholder="image"
                    onChange={handleImageChange}
                    autoComplete="off"
                />
                <div className="buttons">
                  <div onClick={handleCancel}><div className="btnText">Cancel</div><div className={styles.btnIcon}>cancel</div></div>
                  <div onClick={handleDelete}>remove</div>
                  <div onClick={handleSubmit}><div className="btnText">Save</div><div className={styles.btnIcon}>submit</div></div>

                </div>
        
        </form>
        </div>
        

        


    
    </div>




  );
}