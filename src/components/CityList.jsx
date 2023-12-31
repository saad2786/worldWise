import React from 'react'
import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from './Spinner'
import Message from './Message'
import { useCities } from '../Context/CitiesContext'

export default function CityList() {
  const { cities, isLoading } = useCities()
  if (isLoading) return <Spinner />
  if (!cities.length)
    return <Message message="Add you first city in the list" />
  return (
    <ul className={styles.cityList}>
      {cities.map(function (city) {
        return <CityItem city={city} key={city.cityName} />
      })}
    </ul>
  )
}
