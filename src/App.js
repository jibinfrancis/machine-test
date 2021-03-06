import React,{useState,useEffect} from 'react'
import './App.css';
import {Scatter} from 'react-chartjs-2'
import NavBar from './components/navBar'
import * as Services from './services'

function App() {
const [graphData,setGraphData] = useState('');
const [cities,setCities] = useState('');
const [selectedCity,setSelectedCity] = useState('');
const [locations,setLocations] = useState('');
const [loader,setLoader] = useState(false)
const [selectedLocation,setSelectedLocation] = useState('');
const [selectedDate,setSelectedDate] = useState('');
const [errorflag,setErrorflag] = useState(false)
const [category,setCategory] = useState('city');
useEffect(()=>{
getCitiesData()
},[])
const getCitiesData = async() => {
try{
const citiesData = await Services.getCities()
setCities(citiesData.data.results)
}
catch(err){
console.log(err)
}
}
const cityDataHandle = async(event) => {
    setErrorflag(false)
    setSelectedDate('')
    setSelectedCity(event.target.value)
    setGraphData('')
    const locationData = await Services.getLocations(event.target.value)
    const sortedLocations = locationData.data.results.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    setLocations(sortedLocations)

}
const categorySelectionHandle = (selectedCategory) => {
  if(selectedCategory===category){
    return
  }
  else{
  setCategory(selectedCategory)
  setSelectedCity('');
  setSelectedLocation('')
  setSelectedDate('');
  setGraphData('');
  }
}
const changeLocationHandle = (event) => {
  setErrorflag(false)
  setSelectedDate('')
  setSelectedLocation(event.target.value)
  setGraphData('')

} 
const fetchDataCity = async() => {
  if(selectedDate === '' || selectedCity === ''){
    setErrorflag(true)
  }
  else{
    setLoader(true)
    let pollutantData = [];
    let pollutantDataNO2 = [];
    let pollutantDataPM10 = [];
    try{
      const receivedDataPM = await Services.getMeasurements('pm25',selectedDate,selectedCity)
    if(receivedDataPM.status===200){
    receivedDataPM?.data.results.forEach((result)=>{
      
    pollutantData.push({x : (new Date(result.date.utc).getHours()),y : result.value})
    })
  }
  }
    catch(err){
      console.log(err)
      setLoader(false)
    }
  
    try{
    const receivedDataNo2 = await Services.getMeasurements('no2',selectedDate,selectedCity)
    if(receivedDataNo2.status===200){
  
    receivedDataNo2?.data.results.forEach(no2=>{
     pollutantDataNO2.push({x :new Date(no2.date.utc).getHours(),y: no2.value})
    })
  }
  }
  catch(error){
    setLoader(false)
    console.log(error)
  }
  try{
    const receivedDataPM10 = await Services.getMeasurements('pm10',selectedDate,selectedCity)
    if(receivedDataPM10.status===200){
    receivedDataPM10?.data.results.forEach(PM10=>{
      pollutantDataPM10.push({x :new Date(PM10.date.utc).getHours(),y: PM10.value})
     })
  
    }
    }
    catch(err){
      console.log(err)
      setLoader(false)
    }
    setGraphData({
    datasets:[{
    label:'Pollution Data(PM2.5)',
    data:pollutantData,
    backgroundColor: 'rgba(255, 99, 132, 1)',
    borderWidth:4,
    },
    {
      label:'Pollution Data(NO2)',
      data:pollutantDataNO2,
      backgroundColor: '#61dafb',
      borderWidth:4,
      },
      {
        label:'Pollution Data(PM10)',
        data:pollutantDataPM10,
        backgroundColor: 'aquablue',
        borderWidth:4,
        }
    ]
    
    })
  setLoader(false)
  }
  }
const fetchData = async() => {
if(selectedLocation ==='' || selectedDate === '' || selectedCity === ''){
  setErrorflag(true)
}
else{
  setLoader(true)
  let pollutantData = [];
  let pollutantDataNO2 = [];
  let pollutantDataPM10 = [];
  try{
    const receivedDataPM = await Services.getAverages('pm25',selectedDate,selectedLocation)
  if(receivedDataPM.status===200){
  receivedDataPM?.data.results.forEach((result)=>{
    
  pollutantData.push({x : (new Date(result.hour).getHours()),y : result.average})
  })
}
}
  catch(err){
    console.log(err)
    setLoader(false)
  }

  try{
  const receivedDataNo2 = await Services.getAverages('no2',selectedDate,selectedLocation)
  if(receivedDataNo2.status===200){

  receivedDataNo2?.data.results.forEach(no2=>{
   pollutantDataNO2.push({x :new Date(no2.hour).getHours(),y: no2.average})
  })
}
}
catch(error){
  setLoader(false)
  console.log(error)
}
try{
  const receivedDataPM10 = await Services.getAverages('pm10',selectedDate,selectedLocation)
  if(receivedDataPM10.status===200){
  receivedDataPM10?.data.results.forEach(PM10=>{
    pollutantDataPM10.push({x :new Date(PM10.hour).getHours(),y: PM10.average})
   })

  }
  }
  catch(err){
    console.log(err)
    setLoader(false)
  }
  setGraphData({
  datasets:[{
  label:'Pollution Data(PM2.5)',
  data:pollutantData,
  backgroundColor: 'rgba(255, 99, 132, 1)',
  borderWidth:4,
  },
  {
    label:'Pollution Data(NO2)',
    data:pollutantDataNO2,
    backgroundColor: '#61dafb',
    borderWidth:4,
    },
    {
      label:'Pollution Data(PM10)',
      data:pollutantDataPM10,
      backgroundColor: 'aquablue',
      borderWidth:4,
      }
  ]
  
  })
setLoader(false)
}
}
const options= {
  scales: {
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Hours'
      },
      ticks: {
        min:0,
        max: 24
    }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Pollutant'
      },
      ticks: {
        min:0,
    }
      
    }]
  },
  maintainAspectRatio: false,     
}
return (
<div className="App">
  <NavBar />
<div>
  <div className="header" >
    <p>Get the daily pollution data based on </p>
  </div>
  <div className="category">
  <button onClick={()=>categorySelectionHandle('city')} className={category==='city'?"btn btn-category active":"btn btn-category"}>City</button>
  <button onClick={()=>categorySelectionHandle('location')} className={category==='location'?"btn btn-category active":"btn btn-category"}>Location</button>
  </div>
  
  <div className={category==='location'?"search show":" search hide"}>
<select value={selectedCity} className="inputFields" placeholder="select city" onChange={cityDataHandle}>
  <option value="">Select city</option>
  {cities.length>0 &&
  cities.map((city,index)=>{
    return <option key={index} value={city.city}>{city.city}</option>
  })
}
</select>
<select value={selectedLocation} className="inputFields" placeholder="select Location" onChange={changeLocationHandle}>
  <option value="">Select Location</option>
  {locations.length>0 &&
  locations.map((location,index)=>{
    return <option key={location.id} value={location.id}>{location.name}</option>
  })
}
</select>
<input type="date" value={selectedDate} placeholder="dd-mm-yyyy" max={new Date().toISOString().slice(0,10)} className="inputFields" 
onChange={(event)=>{
  setGraphData('')
  setSelectedDate(event.target.value)
  setErrorflag(false)
}}
/>
<button className="btn" onClick={fetchData}>proceed</button>
</div>
<div className={category==='city'?"search":" search hide"}>
<select value={selectedCity} className="inputFields" placeholder="select city" onChange={cityDataHandle}>
  <option value="">Select city</option>
  {cities.length>0 &&
  cities.map((city,index)=>{
    return <option key={index} value={city.city}>{city.city}</option>
  })
}
</select>
<input type="date"  value={selectedDate} placeholder="dd-mm-yyyy" max={new Date().toISOString().slice(0,10)} className="inputFields" 
onChange={(event)=>{
  setGraphData('')
  setSelectedDate(event.target.value)
  setErrorflag(false)
}}
/>
<button className="btn" onClick={fetchDataCity}>proceed</button>
</div>
</div>
<div className="error_division">
  {errorflag&&<p>Select relevant fields!</p>}
</div>
<div className="graph">
{graphData&&
<div className="content">
<Scatter data={graphData} options={options} height="380px" />
</div>
}
</div>
{loader?<div className="lds-dual-ring"></div>:null}
</div>
);
}

export default App;