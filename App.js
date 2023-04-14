    import React, { Component ,useState,useEffect} from 'react';  
    import { Search,StyleSheet, View,Button,Text,Input, TextInput, PermissionsAndroid } from 'react-native';  
    import MapView from 'react-native-maps';  
    import { Marker } from 'react-native-maps'; 
    import { useRef } from "react";
    import Geolocation from 'react-native-geolocation-service';
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
          console.log('You can use Geolocation');
          return true;
        } else {
          console.log('You cannot use Geolocation');
          return false;
        }
      } catch (err) {
        return false;
      }
    };
    const api = {
        // key: "b9230736bb7e18c66e3887ef29281385",
        // key: "a568c4f0ea28e846aca2f00847d83b76",
        key: "104f0441984d6377f643c38213dc3528",
        base: "https://api.openweathermap.org/data/2.5/",
        icon:"http://openweathermap.org/img/wn/"
      }
      const defaultcoords = {
        latitude: 12.9333,
        longitude: 79.1333,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }

    
    export default function App() {
        const [query, setQuery] = useState('');
        const [weather, setWeather] = useState({});
        const [CurrentCity, setCurrentCity] = useState("My Original Text");
        const [location, setLocation] = useState(false);
        const [distanceBetween,setDistanceBetween]=useState('');

        const nameofcity = () => {
          return (weather.weather[0].main)
        }
  
  const searchcoord = evt =>{
     
  }



  const search = evt => {
    
      async function fetchData(text) {
        const res = await fetch(
          `${api.base}weather?q=${query}&units=metric&APPID=${api.key}`,
        );
        res
          .json()
          .then((res) => {
            setWeather(res);
            console.log(res);
          })
          .then(res => {
            console.log(query);
            setWeather(res);

            //setQuery('');
            console.log(res);
          });
          
          
      }


      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          console.log(query);
          setWeather(result);
          //setQuery('');
          console.log(result);
        });
    
  }
        const mapRef = useRef(null);
        const [region, setRegion] = useState({
        });
        const tokyoRegion = {
          latitude: 35.6762,
          longitude: 139.6503,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        // const currentRegion = {
        //   latitude: (weather.coord.lat),
        //   longitude: (weather.coord.lon),
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // };

        const goToTokyo = () => {
          //complete this animation in 3 seconds
          //mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);
          console.log(query);
          search(query);
          setCurrentCity(weather.name);
          setDistanceBetween( distance(weather.coord.lat, location.coords.lat, weather.coord.lon, location.coords.lon));
        };
        const setlat = () => {
          if(typeof weather.coord == undefined){
            return `${defaultcoords.latitude}`
          }
          else 
            return weather.coord.lat
        };
        const goToLocation = () => {
          console.log(query);
          search(query);
          if(weather.name){
            setCurrentCity(weather.name);
            setRegion({
             latitude:(weather.coord.lat),
             //latitude: setlat(),
             longitude:(weather.coord.lon),
             latitudeDelta:0.04,
             longitudeDelta:0.04,
            });
          }  
          if(weather)
          console.log(region);
          mapRef.current.animateToRegion(region, 3 * 1000);
          if(weather&&location){
            setDistanceBetween( distance(weather.coord.lat, location.coords.latitude, weather.coord.lon, location.coords.longitude));
          }  
          };
        const loopfunc = () =>{
          console.log('loopfunc');
          mapRef.current.animateToRegion(region, 3 * 1000);
         

        }


        useEffect(() => {
          // setQuery('632006')
          getLocation();
          console.log(location)
          console.log(query)
          search()
          setCurrentCity(weather.name)
        //   setRegion({
        //   latitude: (weather.coord.lat),
        //   longitude: (weather.coord.lon),
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // })
        loopfunc()

        // const interval = setInterval(() => {
        //   mapRef.current.animateToRegion(region, 3 * 1000);
        // }, 1000);
      },[])
      const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
          console.log('res is:', res);
          if (res) {
            Geolocation.getCurrentPosition(
              position => {
                console.log(position);
                setLocation(position);
                setRegion({
                  latitude:(position.coords.latitude),
                  longitude:(position.coords.longitude),
                  latitudeDelta:0.03,
                  longitudeDelta:0.03,
                });
                mapRef.current.animateToRegion(region, 3 * 1000);
              },
              error => {
                // See error code charts below.
                console.log(error.code, error.message);
                setLocation(false);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }
        });
        console.log(location);
        console.log(location);

      };
      function distance(lat1,
        lat2, lon1, lon2)
{

// The math module contains a function
// named toRadians which converts from
// degrees to radians.
lon1 =  lon1 * Math.PI / 180;
lon2 = lon2 * Math.PI / 180;
lat1 = lat1 * Math.PI / 180;
lat2 = lat2 * Math.PI / 180;

// Haversine formula
let dlon = lon2 - lon1;
let dlat = lat2 - lat1;
let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);
  
let c = 2 * Math.asin(Math.sqrt(a));

// Radius of earth in kilometers. Use 3956
// for miles
let r = 6371;

// calculate the result
return(c * r);
setDistanceBetween('c*r');
console.log(distanceBetween);
}


        return (
          <View style={styles.container}>
            
             
            
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                //latitude: 24.8607,
                //longitude: 67.0011,
                latitude:12.9333,
                longitude:79.1333,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                
              }}
              onRegionChangeComplete={(region) => setRegion(region)}
            />
           <Button  onPress={() => goToTokyo()} title="Set Location" />
            <Button  onPress={() => goToLocation()} title="Go to Location" />
            <Button  onPress={getLocation} title="Set Current Location"/>
            <Text style={styles.text}>Current latitude :{region.latitude}</Text>
            <Text style={styles.text}>Current longitude :{region.longitude}</Text>
            <Text style={styles.text}>{CurrentCity}</Text> 
            
            <Text style={styles.text}>{distanceBetween} KMs</Text> 
              
            
            
          <TextInput 
            type="text"
            className="search-bar"
            placeholder="Enter Zipcode or City"
            style ={styles.searchbox}
            onChangeText={(text) => {
              setQuery(text);
            }}
            value={query}
            //onKeyPress={search}
            

          />
          
          </View>
          
        );
      }
      const styles = StyleSheet.create({
        container: {
          ...StyleSheet.absoluteFillObject,
          
          justifyContent: "flex-end",
          alignItems: "center",
        },
        button:{
          ...StyleSheet.absoluteFillObject,
          
          alignItems:"center",
        },
        map: {
          ...StyleSheet.absoluteFillObject,
          flex:1,
        },
        searchbox :{
          flex:1,
        },
        text: {
          fontSize: 20,
          
          backgroundColor: "lightblue",
        },
        textselectedcity: {
          fontsize:20,
          flex: 1,
        }
      });

    /*  
    export default class App extends Component {  
      render() {  
        return (  
          <View style={styles.MainContainer}>  
      
            <MapView  
              style={styles.mapStyle}  
              showsUserLocation={false}  
              zoomEnabled={true}  
              zoomControlEnabled={true}  
              initialRegion={{  
                latitude: 28.579660,   
                longitude: 77.321110,  
                latitudeDelta: 0.0922,  
                longitudeDelta: 0.0421,  
              }}>  
      
              <Marker  
                coordinate={{ latitude: 28.579660, longitude: 77.321110 }}  
                title={"JavaTpoint"}  
                description={"Java Training Institute"}  
              />  
            </MapView>  
              
          </View>  
        );  
      }  
    }  
      
    const styles = StyleSheet.create({  
      MainContainer: {  
        position: 'absolute',  
        top: 0,  
        left: 0,  
        right: 0,  
        bottom: 0,  
        alignItems: 'center',  
        justifyContent: 'flex-end',  
      },  
      mapStyle: {  
        position: 'absolute',  
        top: 0,  
        left: 0,  
        right: 0,  
        bottom: 0,  
      },  
    });  */