import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import DeckGL, { CompositeLayer, MapView, View } from 'deck.gl';
import {IconLayer, ScatterplotLayer} from '@deck.gl/layers';
import {Map, StaticMap, MapContext, NavigationControl} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';

import {DataFilterExtension} from '@deck.gl/extensions';

import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

import  data  from './ontario_place_tree_species.json';
import  data2  from './trees_west_island.json';
import  dataFam  from './treeFamilies.json';
import mapleIco from "./mapleIcon.png";
import poplarIco from "./poplarIcon.png";
import mulberryIco from "./mulberryIcon.png";
import pineIco from "./pineIcon.png";
import locustIco from "./honeysuckleIcon.png";
import ashIco from "./ashIcon.png";
import willowIco from "./willowIcon.png";
import aspenIco from "./aspenIcon.png";
import larchIco from "./larchIcon.png";
import spruceIco from "./spruceIcon.png";
import oakIco from "./oak.png";


console.log(  mapleIco);
const icons = [oakIco, mapleIco, pineIco, spruceIco, aspenIco, locustIco, oakIco ,aspenIco, willowIco, ashIco, locustIco, locustIco, poplarIco, aspenIco, larchIco]
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidmVudG9saW5lIiwiYSI6ImNsbjBzYnY3eDFzb24yc3F2OW1hZ3V2YWoifQ.pelghd1_gDY9DeAYv3rrAw';
//const  dataTrees = require("./ontario_place_tree_species.json");// customData;

// sort data
let   treeTypes  = [];
   let treeArray = [];
   let ptType    = [];
   let ptArray   = [];

   let treeFamilies = []
   let treeValid = []
   let treeFamValid = []
   let treeFam2Valid = []
   let temp = []
   let temp2 = []

  for (let i = 0; i < data2.features.length; i++ )
  {

    //treeArray.push( data.features[i].properties.SP_CODE)
    treeArray.push( data2.features[i].properties.tag)
      ptArray.push( data2.features[i].geometry.type)

      //add only tree not dead and on the west island 
     // if( (data.features[i].properties.SP_CODE!== "DEAD") && (data.features[i].geometry.coordinates[0] < -79.418) && (data.features[i].geometry.coordinates[1] < 43.6293 )  )
      if( (data2.features[i].properties.tag!== "DEAD") 
          && (data2.features[i].geometry.coordinates[0] < -79.418) 
          && (data2.features[i].geometry.coordinates[1] < 43.6293 )  )
      {
        treeValid.push( data.features[i].properties.SP_CODE)  
        temp2.push( data2.features[i].properties.family)

        for (let j = 0; j < dataFam.TreeFamilies.length; j++){
          if( dataFam.TreeFamilies[j].SP_CODE ===  data2.features[i].properties.tag )
          {        temp.push(dataFam.TreeFamilies[j].family)
          //  console.log(dataFam.TreeFamilies[j].SP_CODE)
            // console.log(dataFam.TreeFamilies[j].family)
            break;
}

        }
      }


   }
   console.log(treeArray);

   treeTypes = treeArray.filter((item, index) => treeArray.indexOf(item) === index);
   ptType = ptArray.filter((item,  index) => ptArray.indexOf(item) === index);
   treeFam2Valid = temp2.filter((item,  index) => temp2.indexOf(item) === index);
  
     // console.log(treeTypes);

      treeValid = treeValid.filter((item,
        index) => treeValid.indexOf(item) === index);
      
      
        treeFamValid = temp.filter((item,
          index) => temp.indexOf(item) === index);
        
        
      //  console.log("treeValid");
       // console.log(treeValid);
       // console.log("treeFamValid");
       // console.log(treeFamValid);
//
        console.log("treeFam2Valid");
        console.log(treeFam2Valid);



      for (let i = 0; i < dataFam.TreeFamilies.length; i++ )
  {
   // if(i ==0){
    let tree = {
      SP_CODE: dataFam.TreeFamilies[i].SP_CODE,
      name : dataFam.TreeFamilies[i]['full-name'],
      commonName : dataFam.TreeFamilies[i]['common-name'],
      family : dataFam.TreeFamilies[i]['family'],

    }
    treeFamilies.push( tree)
     // ptArray.push( data.features[i].geometry.type)
   }

   console.log(treeFamilies)

   //colors for icons_______________________________________________________________

let colors = [] // [[240,240,240] , [255,22,0] ,
 // [0, 0, 0],  //black and white for special cases


for (let i = colors.length-1; i < treeTypes.length -1; i++ )
  {
    colors.push([Math.random()*250, Math.random()*170+80, Math.random()*220, 200 ]);
  }

  //colors[13] = [250,245,240] 
  console.log("colors");
  console.log(colors);


  // tooltip


// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -79.42,  //-122.41669,
  latitude: 43.628077, //37.7853,
  zoom: 17.5,//17.25,
  pitch: 0,
  bearing: 0
};

/* const biluLayer = new MapboxLayer {
  'id': 'add-3d-buildings',
  'source': 'composite',
  'source-layer': 'building',
  'filter': ['==', 'extrude', 'true'],
  'type': 'fill-extrusion',
  'minzoom': 15,
  'paint': {
  'fill-extrusion-color': '#aaa',
   
  // Use an 'interpolate' expression to
  // add a smooth transition effect to
  // the buildings as the user zooms in.
  'fill-extrusion-height': [
  'interpolate',
  ['linear'],
  ['zoom'],
  15,
  0,
  15.05,
  ['get', 'height']
  ],
  'fill-extrusion-base': [
  'interpolate',
  ['linear'],
  ['zoom'],
  15,
  0,
  15.05,
  ['get', 'min_height']
  ],
  'fill-extrusion-opacity': 0.6
  };
 */
function App() {
  const [selectedOption, setSelectedOption] = useState('all');

  function handleChange(event) {
    setSelectedOption(event.target.value);
    console.log(event.target.value);

  }


 const [hoverInfo, setHoverInfo] = useState(false);
 

  const layers = [

   // new ScatterplotLayer({
      new IconLayer({
        id: "trees",
      data: data2.features, 
      getIcon: d =>({ url:  icons[treeFam2Valid.indexOf(d.properties.family)],//  poplarIco,
     width: 128,
     height: 128,
     //anchorY:128, 
     mask:true //needed for colors
    }), 
    getPosition:  d => d.geometry.coordinates ,
    //  getRadius:d => ((d.properties.CrownRad + 1)),
     getSize: d => ((d.properties.CrownRad + 1) * 2 ),
   //  getFillColor:  d => ((d.geometry.coordinates[1] < 43.6293  &&  d.geometry.coordinates[0] < -79.418) /* && d.properties.SP_CODE !== "DEAD" */ )? 
      sizeScale: 1,
      sizeUnits : "meters",
      sizeMinPixels : 12,
      getAngle : d => (Math.random()*360 ),   
     
       getColor: d => (d.geometry.coordinates[1] < 43.6293  &&  d.geometry.coordinates[0] < -79.418)?  /* && d.properties.SP_CODE !== "DEAD" */ 
       [
        colors[treeTypes.indexOf(d.properties.tag)][0],
        colors[treeTypes.indexOf(d.properties.tag)][1], 
        colors[treeTypes.indexOf(d.properties.tag)][2],
        (selectedOption === "all") || (selectedOption === d.properties.family) ?  220: 20
       ]  //(selectedOption === "all") || (selectedOption === treeFamilies.find((el) => el.SP_CODE === d.properties.SP_CODE).family) ?  220: 20] 
         : [0,0,0,0] 
       ,
         updateTriggers: {
          //getFillColor: [selectedOption]
          getColor: [selectedOption]
         },  
      
    //'marker',
     
    //  iconAtlas: poplarIco // icons[Math.floor(Math.random()*9)] 
    
      //icons[Math.floor(Math.random()*5)]
      //d => icons[treeTypes.indexOf(d.properties.tag)] ,
       // mapleIco,
      //  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    /*     iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          anchorY: 50,
          mask: true,
        }, 
      }, 
     // iconAtlas: "./oak.png" ,//'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png', //'./ash.png',
      iconMapping: ICON_MAPPING,
      getIcon: d => ({
        url: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
        width: 68,
        height: 128,
        anchorX: 128,
        anchorX: 128,
        mask:true
      }),
     sizeScale: 125,// d => ((d.properties.CrownRad + 1)*1000),
 */

      //opacity: d => (d.geometry.coordinates[1] < 43.6293  &&  d.geometry.coordinates[0] < -79.418)? 100:0,
      // d.geometry.coordinates[1]? Math.floor( d.geometry.coordinates[1]/10)/10 : 1,
     // getFilterValue: f => f.properties.coordinates,  
     // filterRange: [[-79.4, 43.6], [-79.42, 43.6293]], 
      //extensions: [new DataFilterExtension({filterSize: 1})],
      pickable:  true, //d => (d.geometry.coordinates[1] < 43.6293  &&  d.geometry.coordinates[0] < -79.418)? true : false ,
      onHover: d =>{ 
        d.object ?    console.log( treeFamilies.find((el) => el.SP_CODE === d.object.properties.tag).family  )  :  console.log(d);
        d.object && (d.object.geometry.coordinates[1] < 43.6293  &&  d.object.geometry.coordinates[0] < -79.418) /* && d.object.properties.SP_CODE !== "DEAD" */?  
        setHoverInfo(d) :   console.log( "out of range "+ d); 
      }
        

})



  ];

  return (
    <div><button className="btn mainBtn"  > Find out more </button>

      <DeckGL
    initialViewState={INITIAL_VIEW_STATE}
    controller={true}
    layers={layers}
  /*  getTooltip = {({object}) => object && object.message}
  */    >



     {hoverInfo.object && (


        <div className="infoBox" style={{   /* left: hoverInfo.x, top: hoverInfo.y */ }}>

          <div style={{height: '50px'}}>
            <h2 > { hoverInfo.object.properties.full_name.split("(")[0]}</h2>
            </div>
          <p ><span id="tree-family"> {"(" + hoverInfo.object.properties.full_name.split("(")[1]} </span>
           <br/> {  hoverInfo.object.properties.family} family
         
           <br/>
           <br/>Canopy: { hoverInfo.object.properties.CANOPYW !== 0? " " + hoverInfo.object.properties.CANOPYW + "m "  : "" }
           <br/>Crown radius: { hoverInfo.object.properties.CrownRad !== 0? " " + hoverInfo.object.properties.CrownRad + "m   "  : "" }
           <br/>Height: { hoverInfo.object.properties.HTOTAL !== 0 ? " "  + hoverInfo.object.properties.HTOTAL + "m "  : "" } 
           <br/>Diameter: { hoverInfo.object.properties.DBH !== 0 ? " "  + hoverInfo.object.properties.DBH + "'' "  : "" } 

         <br/> { hoverInfo.object.properties.Cultivar !== "" && hoverInfo.object.properties.Cultivar !== null? " by " + hoverInfo.object.properties.Cultivar  : "" }
      
          </p>

        {/*  //old json data type
         <h2> { treeFamilies.find((obj) => obj.SP_CODE  === hoverInfo.object.properties.tag).commonName}</h2>
          <p ><span id="tree-family"> { treeFamilies.find((obj) => obj.SP_CODE  === hoverInfo.object.properties.tag).name }
           <br/> ({ treeFamilies.find((obj) => obj.SP_CODE  === hoverInfo.object.properties.SP_CODE).family} family)</span>
         
           <br/>
           <br/>Canopy: { hoverInfo.object.properties.CANOPYW !== 0? " " + hoverInfo.object.properties.CANOPYW + "m "  : "" }
           <br/>Crown radius: { hoverInfo.object.properties.CrownRad !== 0? " " + hoverInfo.object.properties.CrownRad + "m   "  : "" }
           <br/>Height: { hoverInfo.object.properties.HTOTAL !== 0 ? " "  + hoverInfo.object.properties.HTOTAL + "m "  : "" } 
           <br/>Diameter: { hoverInfo.object.properties.DBH !== 0 ? " "  + hoverInfo.object.properties.DBH + "'' "  : "" } 

         <br/> { hoverInfo.object.properties.Cultivar !== "" && hoverInfo.object.properties.Cultivar !== null? " by " + hoverInfo.object.properties.Cultivar  : "" }
        <br/><i id="sideNote">   { hoverInfo.object.properties.Creator !="" ||  hoverInfo.object.properties.Creator !="null"? "listed by " + hoverInfo.object.properties.Creator + " ": " "} 
         the {  Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(new Date(+hoverInfo.object.properties.CreationDate)) } </i>
          </p> */}
<p></p>
          { hoverInfo.object.properties.SP_CODE !== "DEAD" && (
            
          <button className="btn"> 
          {  //adjust the article before a vowel
          (hoverInfo.object.properties.family.charAt(0) === "A" ||  hoverInfo.object.properties.family.charAt(0) === "E" || 
           hoverInfo.object.properties.family.charAt(0) === "I" ||  hoverInfo.object.properties.family.charAt(0) === "O" || 
           hoverInfo.object.properties.family.charAt(0) === "U" ) ?  "Adopt an ": "Adopt a " }
           { hoverInfo.object.properties.family} </button>

/* 
          <button className="btn"> 
          { (treeFamilies.find((obj) => obj.SP_CODE  === hoverInfo.object.properties.SP_CODE).family === "Ash" ) ||
          (treeFamilies.find((obj) => obj.SP_CODE  === hoverInfo.object.properties.SP_CODE).family === "Elm" )
           ?  "Adopt an ": "Adopt a " }
           { treeFamilies.find((obj) => obj.SP_CODE  === hoverInfo.object.properties.SP_CODE).family} </button>
 */
)}
        </div>
      )}{  /* */ }

          <Map 
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN} 
          mapStyle="mapbox://styles/ventoline/ck9w3m3mv02qy1io3kas57of9" /* "mapbox://styles/mapbox/light-v9" */
          
          />
</DeckGL> 
          <div className="tree-selector" onChange={handleChange}  > 
         <div style={{display: 'flex', height:'100%', minHeight: '100%' }}> <p>Select a tree Family</p></div>
         <div style={{display: 'flex', height:'100%'}}> <ul>
            <li  key="all"><input type="radio" value="all" name="all" onChange={console.log("changed")} checked= {selectedOption === "all"}   readOnly 
></input>All
</li>
          {treeFam2Valid.map((el, index) =>
          (
<li  key={index}>
  <input type="radio" value={el}  
    onChange={console.log("changed " + selectedOption)}
checked={selectedOption === el } 
  name={el} readOnly >

  </input>
{el}
</li>

         ) ) }
            </ul></div>
            
            </div>
  {/*  */}
 </div>
  );
}

export default App;
