import { useState } from 'react';
import { useParams } from 'react-router';

const AddUserToTrip = ({ user, api_url }) => {

    const [username, setUsername] = useState(user?.username || "");
    const { trip_id } = useParams();

    const addUserToTrip = async (event) => {
        event.preventDefault();
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        }
        await fetch(`${api_url}/users-trips/create/` + trip_id, options);
        window.location.href = '/'
    }

    return (
        <div>
            <center><h3>Add Traveler to Trip</h3></center>
            <form>
                <label>Username</label> <br />
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                <br />

                <label>Trip ID</label><br />
                <input type="number" id="trip_id" name="trip_id" value={trip_id} readOnly /><br />
                <br />

                <input type="submit" value="Submit" onClick={addUserToTrip} />
            </form>
        </div>
    )
}

export default AddUserToTrip
