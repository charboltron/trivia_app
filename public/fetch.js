
// GET request with async/await - inside functions
async function getTriviaAsync() {
  let response = await fetch(url);
  // console.log(response);
  let data = await response.json();
  // console.log(data);
  // console.log(data.name);
}

const getDataAsync2 = async () => {
  let response = await fetch(url);
  // console.log(response);
  let data = await response.json();
  // console.log(data);
  // console.log(data.name);
};
getDataAsync2();
