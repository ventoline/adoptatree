import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import DeckGL from 'deck.gl';
import {LineLayer, ScatterplotLayer} from '@deck.gl/layers';
import {Map, StaticMap, MapContext, NavigationControl} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

import  data  from './ontario_place_tree_species.json';

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidmVudG9saW5lIiwiYSI6ImNsbjBzYnY3eDFzb24yc3F2OW1hZ3V2YWoifQ.pelghd1_gDY9DeAYv3rrAw';
//const  dataTrees = require("./ontario_place_tree_species.json");// customData;

// sort data
  let treeTypes 
   let treeArray = [];
   let ptType    = [];
   let ptArray    = [];

  for (let i = 0; i < data.features.length; i++ )
  {
   // if(i ==0){
      treeArray.push( data.features[i].properties.SP_CODE)
      ptArray.push( data.features[i].geometry.type)
   }
   console.log(treeArray);

   treeTypes = treeArray.filter((item,
    index) => treeArray.indexOf(item) === index);
    ptType = ptArray.filter((item,
      index) => ptArray.indexOf(item) === index);
  
      console.log(treeTypes);

let colors = [[240,240,240, 100] , [255,22,0, 100] ,
  [0, 0, 0, 255],  //black and white for special cases
]

for (let i = colors.length-1; i < treeTypes.length -1; i++ )
  {
    colors.push([Math.random()*255, Math.random()*255, Math.random()*255, 200 ]);
  }

  colors[13] = [250,245,240] 
  console.log(colors);


  // tooltip


// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -79.42,  //-122.41669,
  latitude: 43.628077, //37.7853,
  zoom: 17.25,
  pitch: 0,
  bearing: 0
};



/* async function fetchData() {
  const dataImp = await import('./ontario_place_tree_species.json');
  console.log( typeof dataImp);
  //console.log(  dataImp.features[0].properties.CrownRad);
  //console.log(  JSON.stringify(dataImp));
}
 */


function App() {

 const [hoverInfo, setHoverInfo] = useState(false);

  //fetchData();
  const layers = [
 //   new LineLayer({id: 'line-layer', datatest}), 

    new ScatterplotLayer({
      id: "trees",
      data: data.features, /* [{position:  data.geometry.coordinates, 
      radius: data.properties.CrownRad, 
      specie: data.properties.SP_CODE}
      ]
       */
      
      getPosition:  d => d.geometry.coordinates,
      getRadius:   d => (d.properties.CrownRad + 1),
      getFillColor: d =>  d.properties.SP_CODE? colors[treeTypes.indexOf(d.properties.SP_CODE)] : colors[0],
      pickable: true,
      onHover: d =>{ d.object ?  console.log( d.object.properties ) :  console.log(d);
        d.object?  setHoverInfo(d) :  console.log(d) ; 
      }
       
        

})

  ];

  return (
    <div><button className="btn"  > Adopt a Tree </button>

      <DeckGL
    initialViewState={INITIAL_VIEW_STATE}
    controller={true}
    layers={layers} 
  /*  getTooltip = {({object}) => object && object.message}
  */    >
     {hoverInfo.object && (
        <div className="infoBox" style={{   /* left: hoverInfo.x, top: hoverInfo.y */ }}>
          <h2> { hoverInfo.object.properties.SP_CODE }</h2>
        <p> {/*   age: { Date(+hoverInfo.object.properties.CreationDate * 1000)}   */}
         
         <br/>Canopy: { hoverInfo.object.properties.CANOPYW !== 0? " " + hoverInfo.object.properties.CANOPYW + "m "  : "" }
         <br/> Crown radius: { hoverInfo.object.properties.CrownRad !== 0? " " + hoverInfo.object.properties.CrownRad + "m   "  : "" }
         <br/>  Height: { hoverInfo.object.properties.HTOTAL !== 0 ||  hoverInfo.object.properties.HTOTAL !== "0"? " "  + hoverInfo.object.properties.HTOTAL + "m "  : "" }
          <br/> <i>planted the  { Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(new Date(+hoverInfo.object.properties.INW_DATE)) }</i><br/>
         <br/> { hoverInfo.object.properties.Cultivar !== "" && hoverInfo.object.properties.Cultivar !== null? " by " + hoverInfo.object.properties.Cultivar  : "" }
        <br/><i>   { hoverInfo.object.properties.Creator !="" ||  hoverInfo.object.properties.Creator !="null"? "listed by " + hoverInfo.object.properties.Creator: ""} 
          <br/> the {  Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(new Date(+hoverInfo.object.properties.CreationDate)) } </i>
          </p>
        </div>
      )}{  /* */ }

          <Map 
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN} 
          mapStyle="mapbox://styles/mapbox/light-v11"
          />
</DeckGL>   
 </div>
  );
}

export default App;
