export const asyncGetLargePhoto = (id) => {
  return dispatch => {
    let url = 'https://api.500px.com/v1/photos/' + id + '?consumer_key=wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF';
    console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch({type: 'LOAD_LARGE_PHOTO', payload: responseJson.photo});
      })
      .catch((error) => {
        console.error(error);
      });
  }
}