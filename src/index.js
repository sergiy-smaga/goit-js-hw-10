import './css/styles.css';
let debounce = require('lodash.debounce');
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;
let name;

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  name = e.target.value.trim();
  isEmpty(name);
  if (name !== '') {
    fetchCountries(name)
      .then(handleData)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function isEmpty(name) {
  if (name === '') {
    clearAll();
  }
}

function clearAll() {
  refs.div.classList.remove('shown');
  refs.list.classList.remove('shown');
}

function handleData(countries) {
  const divMarkup = countries
    .map(
      ({
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      }) => {
        return `
            <h1 class="header">
                <img class="image" width=40 src="${svg}"/>
                <span class="name">${official}</span>
            </h1>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${Object.values(languages)}</p>
            `;
      }
    )
    .join('');
  const listMarkup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `
        <li class="list-item">
            <img class="image" width=30 src="${svg}"/>
            <span class="name">${official}</span>
        </li>
        `;
    })
    .join('');
  if (countries.length === 1) {
    refs.div.innerHTML = divMarkup;
    refs.div.classList.add('shown');
    refs.list.classList.remove('shown');
  } else if (countries.length > 1 && countries.length <= 10) {
    refs.list.innerHTML = listMarkup;
    refs.list.classList.add('shown');
    refs.div.classList.remove('shown');
  } else {
    clearAll();
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}
