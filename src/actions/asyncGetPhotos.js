export const asyncGetPhoto = (page) => {
  return dispatch => {
    let url = 'https://api.500px.com/v1/photos?feature=popular&consumer_key=wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF&page=' + page;
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch({type: 'ADD_PHOTOS', payload: responseJson.photos});
      })
      .catch((error) => {
        console.error(error);
      });
  }
}