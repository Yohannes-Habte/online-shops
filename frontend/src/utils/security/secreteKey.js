//=================================================================
// Cloudnary
//=================================================================
export const cloud_name = import.meta.env.VITE_CLOUD_NAME;
export const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
export const cloud_URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

//=================================================================
// OpenCage Geocoder. API key
//=================================================================
export const myApiKey = import.meta.env.VITE_OPEN_CAGE_API_KEY;

export const apiKey = import.meta.env.VITE_GEOCODIO_API_KEY;

//=================================================================
// The URL portion
//=================================================================
export const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
