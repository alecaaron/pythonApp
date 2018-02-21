//begin my asychnronously grabbing the json object of
//continents.
const Continents = fetch('https://s3.amazonaws.com/aws-website-alecaaroncom-kjonn/js/continents.js')
  .then(response => response.json())

  /*since the object is a bit hard to enoumerate through when the meat
  of what we want is a whole TWO levels deep! We can water this object down into
  an array and bring the data closer to the surface.

  ....Plus arrays are fun.(:
  */
  .then(data => {
    const Places = [];
    for(places in data){
      Places.push(data[places])
    }

    return Places
    //logs => (5)[{...}, {...}, {...}, ...]
});


/*While that's doing it's thing asychnronously,
we can focus on setting up some UI components to place
the data.
*/
function createContentFrom(obj){

  let frag = new DocumentFragment();

  let resultItem = document.createElement('li');
      resultItem.className = "index-search-results--item";

  let img = new Image();
      img.className = "index-search-results--img";
      img.src = `https://s3.amazonaws.com/aws-website-alecaaroncom-kjonn/img/${obj.img}`;

  // glue all the elements together to form a results-item component
  resultItem.appendChild(img);

  let h2 = document.createElement('h2');
      h2.textContent = obj.name;
      h2.className = "index-search-results--title";
  resultItem.appendChild(h2);

  let bio = document.createElement('p');
      bio.className = "index-search-results--bio";
      bio.textContent = obj.desc;

  let h3 = document.createElement('h3');
      h3.textContent = `${obj.name} has ${obj.countries} countries and animals such as:`;
  bio.appendChild(h3);
  console.log(h3);

  let animalList = document.createElement('ul');
  obj.animals.forEach( x => {
    let animalItem = document.createElement('li');
        animalItem.textContent = x.type;
    animalList.appendChild(animalItem);
  });
  bio.appendChild(animalList);

  //add the final peice tot he resultItem component and glue
  //it to the DOM
  resultItem.appendChild(bio);
  frag.appendChild(resultItem);

  //add the component to the DOM
  document.getElementsByClassName('index-search-results')[0].appendChild(frag);
};

//these flags help us speak english with the compiler
const Search = document.getElementsByClassName('index-search-textInput')[0];
const Results = document.getElementsByClassName('index-search-results')[0];

// listen for key-up events to fire off magic
Search.addEventListener('keyup', e => {

  //clear any previous data written to DOM
  Results.innerHTML = " ";

  //again, just trying to speak english with the compiler
  const search_string = e.target.value;

  //while the search string is not empty fire magic
  if(search_string != ""){

    let myExp = new RegExp(search_string, "i");

    //pick up the Continents array
    Continents.then(arr => {
      //filter out any results that don't match search_string
      return arr.filter(i => i.name.search(myExp) != -1);
    })
    .then(arr => {
      //go through all items that pass the filter and write them to the DOM
      arr.forEach(x => createContentFrom(x));
    });
  }
  else{ // if nothing matches search_string then just display nothing.
    Results.innerHTML = " ";
  }
});//end eventListener();
