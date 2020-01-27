import axios from 'axios'

// Polygon API
const PLY_API_BASE_URL = 'https://api.polygon.io/'
export default axios.create({
                    baseURL: PLY_API_BASE_URL
                })