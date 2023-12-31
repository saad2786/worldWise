import React from 'react'
import styles from './CountryList.module.css'

import CountryItem from './CountryItem'
import Spinner from './Spinner'
import Message from './Message'
import { useCities } from '../Context/CitiesContext'

export default function CountryList() {
  const { cities, isLoading } = useCities()
  if (isLoading) return <Spinner />
  if (!cities.length)
    return <Message message="Add you first city in the list" />

  const countries = cities.reduce(function (arr, city) {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { id: city.id, country: city.country, emoji: city.emoji }]
    else return arr
  }, [])
  return (
    <ul className={styles.countryList}>
      {countries.map(function (country) {
        return <CountryItem country={country} key={country.id} />
      })}
    </ul>
  )
}
