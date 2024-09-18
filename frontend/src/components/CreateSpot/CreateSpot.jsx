
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { newSpot, spotDetails, editSpot } from "../../store/spots";
import './CreateSpot.css'



const CreateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { spotId } = useParams();
    const spotForEdit = useSelector(state => state.spots.spot)

    useEffect(() => {
        if (spotId) {
            dispatch(spotDetails(spotId));
        }
    }, [dispatch, spotId]);

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});
    const [images, setImages] = useState(['', '', '', '']);
    const preview = true;

    useEffect(() => {
        if (spotId && spotForEdit) {
            setAddress(spotForEdit.address);
            setCity(spotForEdit.city);
            setState(spotForEdit?.state)
            setCountry(spotForEdit?.country)
            setLat(spotForEdit?.lat)
            setLng(spotForEdit?.lng)
            setName(spotForEdit?.name)
            setDescription(spotForEdit?.description)
            setPrice(spotForEdit?.price)
            setImages(spotForEdit.SpotImages?.map(image => image.url) || ['', '', '', '']);
        }
    }, [spotForEdit, spotId]);
    // useEffect(() => {
    //     if (spotId && spotForEdit?.SpotImages) {
    //         setImages(spotForEdit.SpotImages.map(image => image?.url || ''));
    //     } else if (!spotId) {
    //         setImages(['', '', '', '']);
    //     }
    // }, [spotId, spotForEdit]);


    const handleImageChange = (i, e) => {
        const newImages = [...images];
        newImages[i] = e.target.value;
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpotData = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            images,
            preview

        }

        const newErrors = {};

        if (images[0].trim() === '') {
            newErrors.images = 'Preview image is required';
        }

        images.forEach((image) => {
            const imageExt = ['.jpg', '.png', '.jpeg']
            if (image.trim() !== '' &&
                !imageExt.some(ext => image.trim().endsWith(ext))) {
                newErrors.jpg = 'URL must end with .jpg, .jpeg or .png';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (spotForEdit) {
            return dispatch(editSpot(newSpotData, spotId))
                .then(res => { navigate(`/spots/${res.id}`) })
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data?.errors) setErrors(data.errors);
                    }
                );
        } else {
            return dispatch(newSpot(newSpotData))
                .then(res => { navigate(`/spots/${res.id}`) })
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data?.errors) setErrors(data.errors);
                    }
                );
        }
    }

    return (

        <div id="create-spot-form-container">
            <div id="create-form-heading">
                <h3>{spotId ? 'Update your Spot' : 'Create a new Spot'}</h3>
                <h4>Where`&apos;`s your place located</h4>
                <p>Guests will only get your exact address once they booked a
                    reservation.</p>
            </div>
            <form className='create-spot-form' onSubmit={handleSubmit}>
                <div className="address">
                    <div className="street-country">
                        {/* <label>Country</label> */}
                        <input
                            type="text"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            placeholder="Country"
                        />
                        {errors.country && <p>{errors.country}</p>}
                        {/* <label> Street Address</label> */}
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Address"
                        />
                        {errors.address && <p>{errors.address}</p>}
                        {/* <label>City</label> */}
                    </div>
                    <input
                        className="city"
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="City"
                    />
                    {errors.address && <p>{errors.city}</p>}
                    {/* <label>State</label> */}
                    <input
                        className="state"
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="State"
                    />
                    {errors.state && <p>{errors.state}</p>}

                    {/* <label>Latitude</label> */}
                    <input
                        className="lattitude"
                        type="number"
                        value={lat}
                        onChange={e => setLat(e.target.value)}
                        placeholder="Latitude"
                    />
                    {errors.lat && <p>{errors.lat}</p>}
                    {/* <label>Longitude</label> */}
                    <input
                        className="longitude"
                        type="number"
                        value={lng}
                        onChange={e => setLng(e.target.value)}
                        placeholder="Longitude"
                    />
                    {errors.lng && <p>{errors.lng}</p>}
                </div>
                <div>
                    <label><h3>Describe your place to guests</h3>
                        <p>Mention the best features of your space, any special amentities like
                            fast wif or parking, and what you love about the neighborhood.
                        </p>
                    </label>
                    <textarea
                        
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="4"
                        placeholder="Please write at least 30 characters">
                    </textarea>
                    {errors.description && <p>{errors.description}</p>}
                </div>
                <div className="title">
                    <label><h3>Create a title for your spot</h3>
                        <p>Catch guests`&apos;` attention with a spot title that highlights what makes
                            your place special.
                        </p></label>
                    <input
                    className="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Name of your spot"
                    />
                    {errors.name && <p>{errors.name}</p>}
                </div>
                <div className="price-div">
                    <label><h3>Set a base price for your spot</h3>
                        <p>Competitive pricing can help your listing stand out and rank higher
                            in search results</p>
                    </label>
                    <input
                    className="price"
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    />
                    {errors.price && <p>{errors.price}</p>}
                </div>
                <section className="image-input">
                    <p>Liven up your spot with photos</p>
                    <p>Submit at least on photo to publish your spot</p>
                    <input
                        type="url"
                        value={images[0]}
                        onChange={e => handleImageChange(0, e)}
                        placeholder="Preview image url"
                    />
                    {errors.images && <p>{errors.images}</p>}
                    {(images[0] && errors.jpg) && <p>{errors.jpg}</p>}
                    <input
                        type="url"
                        value={images[1]}
                        onChange={e => handleImageChange(1, e)}
                        placeholder="Image url"
                    />
                    {(images[1] && errors.jpg) && <p>{errors.jpg}</p>}
                    <input
                        type="url"
                        value={images[2]}
                        onChange={e => handleImageChange(2, e)}
                        placeholder="Image url"
                    />
                    {(images[2] && errors.jpg) && <p>{errors.jpg}</p>}
                    <input
                        type="url"
                        value={images[3]}
                        onChange={e => handleImageChange(3, e)}
                        placeholder="Image url"
                    />
                    {(images[3] && errors.jpg) && <p>{errors.jpg}</p>}
                </section>


              <div className='button-div'>  {spotId ? <button type="submit">Update Spot</button> : <button type="submit">Create Spot</button>}</div>
            </form>
        </div>

    );
};




export default CreateSpot;