import axios from "axios";


// Creates a reusable Axios instance for all backend API requests.
const api = axios.create({

      // Base URL shared by all document management API endpoints.
    baseURL:'https://apis.allsoft.co/api/documentManagement',
})


// Request interceptor runs before every API request.
api.interceptors.request.use((config)=>{

     // Retrieves the authentication token saved during OTP login.
    const token = localStorage.getItem('token')


      // Attaches the token to the request header when available.
    if(token){
        config.headers.token = token
    }

    return config
})

// Exports the configured Axios instance for use across the application.
export default api