export const fetchCountries = function (name) {
  const OPEN_API = 'https://restcountries.com/v3.1/name/';

  return fetch(
    `${OPEN_API}${name}/?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  });
};
