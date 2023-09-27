import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import DeckGL from 'deck.gl';
import {LineLayer, ScatterplotLayer} from '@deck.gl/layers';
import {Map, StaticMap, MapContext, NavigationControl} from 'react-map-gl';


import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

import  data  from './ontario_place_tree_species.json';


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidmVudG9saW5lIiwiYSI6ImNsbjBzYnY3eDFzb24yc3F2OW1hZ3V2YWoifQ.pelghd1_gDY9DeAYv3rrAw';
const DATA_URL ="./ontario_place_tree_species.geojson";
const  dataTrees = require("./ontario_place_tree_species.json");// customData;
console.log(data)
console.log(dataTrees)

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
   treeTypes = treeArray.filter((item,
    index) => treeArray.indexOf(item) === index);
    ptType = ptArray.filter((item,
      index) => ptArray.indexOf(item) === index);
  
      console.log(treeTypes);
      console.log(ptType);

let colors = [
  [0,0,0], 
]

for (let i = colors.length-1; i < treeTypes.length -1; i++ )
  {
    colors.push([Math.random()*255, Math.random()*255, Math.random()*255 ]);
  }
  console.log(colors);


// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -79.418,  //-122.41669,
  latitude: 43.628077, //37.7853,
  zoom: 17,
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

  //fetchData();
  const layers = [
 //   new LineLayer({id: 'line-layer', datatest}), 

    new ScatterplotLayer({
      id: "trees",
      data: data.features
     //   size: data.properties.CrownRad,
        
     //   species: data.properties.SP_CODE, 
     ,
 
      getPosition:  d => d.geometry.coordinates,
      getRadius:   d => d.properties.CrownRad,
      getFillColor: d =>  colors[treeTypes.indexOf(d.properties.SP_CODE.toString())]
   /*     d => { switch (d.properties.SP_CODE){
        case:"acer-fre": 
        colors[0]; break;
        case:"rhus-typ": 
        colors[1]; break;
        case:"pice-omo": 
        colors[2]; break;
        case:"DEAD": 
        colors[3]; break;
        case:"aila-alt": 
        colors[4]; break;
        case:"gled-tri": 
        colors[5]; break;
        case:"frax-exc": 
        colors[6]; break;
        case:"pice-gla": 
        colors[7]; break;
        case:"alnu-glu": 
        colors[8]; break;
        case:"frax-pen": 
        colors[9]; break;
        colors[0]; break;
        case:"rhus-typ": 
        colors[1]; break;
        case:"pice-omo": 
        colors[2]; break;
        case:"DEAD": 
        colors[3]; break;
        case:"aila-alt": 
        colors[4]; break;
        case:"gled-tri": 
        colors[5]; break;
        case:"frax-exc": 
        colors[6]; break;
        case:"pice-gla": 
        colors[7]; break;
        case:"alnu-glu": 
        colors[8]; break;
        case:"frax-pen": 
        colors[9]; break;
        
      } 
    },*/
    // [255, 0, 0],
     
   


})



  ];

  return (
      <DeckGL
    initialViewState={INITIAL_VIEW_STATE}
    controller={true}
    layers={layers} 
    >
          <Map 
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN} 
          mapStyle="mapbox://styles/mapbox/light-v11"
          />
</DeckGL>   
 
  );
}

export default App;
