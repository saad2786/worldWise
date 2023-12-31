import { Link } from 'react-router-dom'
import { useCities } from '../Context/CitiesContext'
import styles from './CityItem.module.css'

export default function CityItem({ city }) {
  const formatDate = (data) => {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  }
  const { deleteCity } = useCities()
  const { currentCity } = useCities()
  const { cityName, emoji, date, id, position } = city
  async function handleDelete(e) {
    e.preventDefault()
    await deleteCity(id)
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id && styles['cityItem--active']
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <span className={styles.name}>{cityName}</span>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={(e) => handleDelete(e)}>
          &times;
        </button>
      </Link>
    </li>
  )
}
