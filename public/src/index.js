import "./styles.css";
import axios from "axios";
import jQuery from "jQuery";

const url = "https://anapioficeandfire.com/api/books/3/";

// GET request with XMLHttpRequest
let request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "json";
request.send();
request.onload = function() {
  let response = request.response;
  console.log(response);
  // console.log(response.name);
  // console.log(response.numberOfPages);
  console.log(response[2].name);
};

// GET request with jQuery
jQuery.get(url, function(data, status) {
  // console.log(data);
  // console.log(status);
  // console.log(data.name);
});

// GET request with Axios with promises
// promises can be fulfilled or rejected
axios.get(url).then(
  response => {
    // console.log(response);
    // console.log(response.data);
    // console.log(response.data.name);
  },
  error => {
    console.log(error);
  }
);

// GET request with Fetch API
fetch(url)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    // console.log(data.name);
    // console.log(data.authors[0]);
    // console.log(data.url);
  })
  .catch(error => {
    // console.log(error);
  });

// GET request with promises - inside functions
function getDataPromise() {
  fetch(url).then(response => response.json());
  // .then(data => console.log(data));
}
getDataPromise();

// GET request with async/await - inside functions
async function getDataAsync() {
  let response = await fetch(url);
  // console.log(response);
  let data = await response.json();
  // console.log(data);
  // console.log(data.name);
}
getDataAsync();

const getDataAsync2 = async () => {
  let response = await fetch(url);
  // console.log(response);
  let data = await response.json();
  // console.log(data);
  // console.log(data.name);
};
getDataAsync2();
