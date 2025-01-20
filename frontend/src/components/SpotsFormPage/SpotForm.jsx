import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addASpot, getOneSpot, updateSpot } from "../../store/spots";
import { addTheImages } from "../../store/spotsImages";
import "./SpotForm.css";

export default function SpotForm({ isNewSpot }) {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { id } = useParams();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1);
  const [previewImg, setPreviewImg] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [img5, setImg5] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isNewSpot && id) {
      dispatch(getOneSpot(id));
    }
  }, [dispatch, id, isNewSpot]);

  const spot = useSelector((state) => state.spots[id]);

  useEffect(() => {
    if (spot && !isNewSpot) {
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setCountry(spot.country || "");
      setDescription(spot.description || "");
      setName(spot.name || "");
      setPrice(spot.price || 1);
      setPreviewImg(spot.previewImage || "");
    }
  }, [id, isNewSpot, dispatch, spot]);
  const getErrors = (e) => {
    e.preventDefault();
    const imgRegex = /\.(jpg|jpeg|png)$/m;
    const errors = {};
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (description.length < 30) errors.description = "Please write at least 30 characters";
    if (!name) errors.name = "Name is required";
    if (!price) errors.price = "Price is required";
    if (!previewImg) errors.previewImg1 = "Preview image is required";
    if (!imgRegex.test(previewImg)) errors.previewImg2 = "Preview image URL must end in .png, .jpg, or .jpeg";

    if (img2 && !imgRegex.test(img2)) errors.img2 = "Image URL must end in .png, .jpg, or .jpeg";
    if (img3 && !imgRegex.test(img3)) errors.img3 = "Image URL must end in .png, .jpg, or .jpeg";
    if (img4 && !imgRegex.test(img4)) errors.img4 = "Image URL must end in .png, .jpg, or .jpeg";
    if (img5 && !imgRegex.test(img5)) errors.img5 = "Image URL must end in .png, .jpg, or .jpeg";
    Object.values(errors).length ? setErrors(errors) : handleSubmit();
  };

  const handleSubmit = async () => {
    const imagesPayload = [
      { url: previewImg, preview: true },
      { url: img2, preview: false },
      { url: img3, preview: false },
      { url: img4, preview: false },
      { url: img5, preview: false },
    ].map((ele) => {
      if (!ele.url) ele.url = "dummyData.png";
      return ele;
    });

    const payload = {
      address,
      city,
      state,
      country,
      name,
      price,
      description,
    };

    let spot;
    if (isNewSpot) {
      console.log("Images Payload:", imagesPayload); // Debugging
      spot = await dispatch(addASpot(payload));
      if (!spot) return <h1>Loading...</h1>;
      console.log("Spot:", payload); // Debugging
      await dispatch(addTheImages(imagesPayload, spot.id));
    } else {
      spot = await dispatch(updateSpot(id, payload));
      if (!spot) return <h1>Loading...</h1>;
    }

    // Debugging: Validate spot and navigate
    if (spot?.id) {
      navigateTo(`/restaurants/${spot.id}`);
    } else {
      console.log("Failed to navigate: Spot data is missing", spot);
    }
  };

  return (
    <form onSubmit={getErrors} className="spot-form">
      <div className="headers">{isNewSpot ? "Add a new Restaurant" : "Update restuarant info"}</div>
      <h3>Where&apos;s the restaurant you&apos;ve eat at located?</h3>
      <p>Whatu&apos;s the location of this restaurant at?</p>
      <div className="location">
        <label>
          Country <span className="errors message">{errors.country ? errors.country : ""}</span>
        </label>
        <input type="text" placeholder="Country" value={country} onChange={({ target: { value } }) => setCountry(value)} />
        <label>
          Street Address <span className="errors message">{errors.address ? errors.address : ""}</span>
        </label>
        <input type="text" placeholder="Street Address" value={address} onChange={({ target: { value } }) => setAddress(value)} />
        <div className="city-state">
          <div className="city">
            <label>
              City <span className="errors message">{errors.city ? errors.city : ""}</span>
            </label>
            <br />
            <input type="text" placeholder="City" value={city} onChange={({ target: { value } }) => setCity(value)} className="city-input" />
            <span className="comma">,</span>
          </div>
          <div className="state">
            <label>
              State <span className="errors message">{errors.state ? errors.state : ""}</span>
            </label>
            <br />
            <input type="text" placeholder="STATE" value={state} onChange={({ target: { value } }) => setState(value)} />
          </div>
        </div>
      </div>
      <div style={{ border: "1px solid gray", marginTop: "1rem" }}></div>
      <h3>Describe the experience in a few short words</h3>
      <p>discuss the highlights of your experience.</p>
      <textarea className="description" type="text" minLength="30" placeholder="Please write at least 30 characters" value={description} onChange={({ target: { value } }) => setDescription(value)} />
      {errors.description ? <div className="errors message">{errors.description}</div> : null}
      <div style={{ border: "1px solid gray", marginTop: "1rem" }}></div>
      <h3>Create a title based on the experience!</h3>
      <p>Catch everyoneu&apos;s attention with your title!</p>
      <input type="text" placeholder="Name of your spot" value={name} onChange={({ target: { value } }) => setName(value)} />
      {errors.name ? <div className="errors message">{errors.name}</div> : null}
      <div style={{ border: "1px solid gray", marginTop: "1rem" }}></div>
      <h3>how much was it per plate?/how much did you pay for the entire meal?</h3>
      <p>stating the pricing can help others determine whether theyu&apos;d like to eat there too!</p>
      <div>
        <span>$ </span>
        <input type="number" min="1" value={price} placeholder="Price per night (USD)" onChange={({ target: { value } }) => setPrice(Number(value))} />
      </div>
      {errors.price ? <div className="errors message">{errors.price}</div> : null}
      <div style={{ border: "1px solid gray", marginTop: "1rem" }}></div>
      <h3>Share photos of the experience and the restaurant you ate at</h3>
      <p>Submit a link to at least one photo to publish your restaurant experience.</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "50%",
        }}
      >
        <input type="text" placeholder="Preview Image URL" value={previewImg} onChange={({ target: { value } }) => setPreviewImg(value)} />
        {errors.previewImg1 && <div className="errors message">{errors.previewImg1}</div>}
        {errors.previewImg2 && <div className="errors message">{errors.previewImg2}</div>}
        <input type="text" placeholder="Image URL" value={img2} onChange={({ target: { value } }) => setImg2(value)} />
        {errors.img2 && <div className="errors message">{errors.img2}</div>}
        <input type="text" placeholder="Image URL" value={img3} onChange={({ target: { value } }) => setImg3(value)} />
        {errors.img3 && <div className="errors message">{errors.img3}</div>}
        <input type="text" placeholder="Image URL" value={img4} onChange={({ target: { value } }) => setImg4(value)} />
        {errors.img4 && <div className="errors message">{errors.img4}</div>}
        <input type="text" placeholder="Image URL" value={img5} onChange={({ target: { value } }) => setImg5(value)} />
        {errors.img5 && <div className="errors message">{errors.img5}</div>}
      </div>
      <div style={{ border: "1px solid gray", marginTop: "1rem" }}></div>
      <div className="button-box">
        <button type="submit" className="add-it">
          {isNewSpot ? "Create restaurant post" : "Update Restaurant info"}
        </button>
      </div>
    </form>
  );
}
