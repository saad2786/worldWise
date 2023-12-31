// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useEffect } from 'react'
import { useState } from 'react'
import { useUrlPosition } from '../hooks/useUrlPosition'
import BackButton from './BackButton'
import Button from './Button'
import Spinner from './Spinner'
import Message from './Message'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Form.module.css'
import { createContext } from 'react'
import { useCities } from '../Context/CitiesContext'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt())

  return String.fromCodePoint(...codePoints)
}

function Form() {
  const [lat, lng] = useUrlPosition()
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState('')
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [emoji, setEmoji] = useState('')
  const navigate = useNavigate()

  const [geocodingError, setGeocodingError] = useState('')
  const { createCity, isLoading } = useCities()
  useEffect(
    function () {
      async function fetchCityData() {
        if (!lat && !lng) return
        try {
          setIsLoadingGeocoding(true)
          setGeocodingError('')
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
          )
          const data = await res.json()
          if (!data.countryCode)
            throw new Error(
              "Thats doesn't seems to be a city,click somewhere else😕",
            )

          setCityName(data.city || data.locality || '')
          setCountry(data.countryName)
          setEmoji(convertToEmoji(data.countryCode))
        } catch (err) {
          setGeocodingError(err.message)
        } finally {
          setIsLoadingGeocoding(false)
        }
      }
      fetchCityData()
    },
    [lat, lng],
  )

  async function handleOnSubmit(e) {
    e.preventDefault()

    if (!cityName || !date) return
    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat, lng },
    }
    await createCity(newCity)
    navigate('/app/cities')
  }

  if (isLoadingGeocoding) return <Spinner />
  if (geocodingError) return <Message message={geocodingError} />
  if (!lat && !lng) return <Message message="Start by clicking on map" />
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={(e) => handleOnSubmit(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <ReactDatePicker
          onChange={(data) => {
            setDate(data)
          }}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">ADD</Button>
        <BackButton />
      </div>
    </form>
  )
}

export default Form
