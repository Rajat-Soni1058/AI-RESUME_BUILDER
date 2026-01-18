import axios from 'axios'

const api = axios.create({
  //baseURL: "https://ai-resume-builder-a3v8.onrender.com"
  baseURL: import.meta.env.VITE_API_BASE_URL


})

export default api
