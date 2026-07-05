import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityBtn from '../components/ActivityBtn';
import './TripDetails.css';

const TripDetails = ({ data }) => {
    const [activities, setActivities] = useState([])
    const [destinations, setDestinations] = useState([])
    const { id } = useParams();

    const trip = data.filter(item => item.id === parseInt(id))[0];

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await fetch('/api/activities/' + id);
            const data = await response.json();
            setActivities(data);
        }
        fetchActivities();
    }, [])

    useEffect(() => {
        const fetchDestinations = async () => {
            const response = await fetch('/api/trips_destinations/destinations/' + id)
            const data = await response.json();
            setDestinations(data)
        }
        fetchDestinations();
    }, [])

    return (
        <div className="TripDetails">
            <div className="flex-container">
                <div>
                    <h2>{trip?.title}</h2>
                    <p>📅 Duration: {trip?.num_days} days</p>
                    <p>✈️ Depart: {trip?.start_date.slice(0, 10)}</p>
                    <p>🛬 Return: {trip?.end_date.slice(0, 10)}</p>
                    <p>{trip?.description}</p>

                    {
                        activities.map((activity) => (
                            <ActivityBtn key={activity.id} id={activity.id} activity={activity.activity} num_votes={activity.num_votes} />
                        ))
                    }
                    <Link to={'/activity/create/' + id}>
                        <button className="addActivityBtn">+ Add Activity</button>
                    </Link>
                </div>

                <div className="right-side" style={{ backgroundImage: `url(${trip?.img_url})` }}>
                    {
                        destinations.map((destination) => (
                            <h2 key={destination.id}>{destination.destination}</h2>
                        ))
                    }
                    <Link to={'/destination/new/' + id}>
                        <button className="addDestinationBtn">+ Add Destination</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TripDetails
