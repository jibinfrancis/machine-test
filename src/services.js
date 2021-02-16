import axios from 'axios'
const API_ROOT = 'https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/'
export const locations = `${API_ROOT}locations`;
export const averages = `${API_ROOT}averages`;
export const cities  = `${API_ROOT}cities`;
export async function getCities() {
    return await axios.get(cities+'?limit=100&page=1&offset=0&sort=asc&order_by=city&country=IN', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  export async function getLocations(id) {
    return await axios.get(locations+'?limit=100&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&dumpRaw=false&city='+id, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }  
  export async function getAverages(parameter,selectedDate,selectedLocation) {
    return await axios.get(averages+'?parameter='+parameter+'&temporal=hour&limit=10000&date_from='+selectedDate+'T00%3A00%3A00.000Z&date_to='+selectedDate+'T23%3A59%3A59.999Z&location='+selectedLocation+'&spatial=location&sort=asc&order_by=hour', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }