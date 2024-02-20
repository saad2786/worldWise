import { useCallback } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
const BASE_URL = 'http://localhost:8000'

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
}
function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      }
    case 'cities/loaded':
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      }

    case 'city/loaded':
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      }
    case 'city/created':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      }
    case 'cities/deleted':
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      }
    case 'rejected':
      return {
        ...state,
        isLoading: true,
        error: action.payload,
      }

    default:
      throw new Error('Unknown type')
  }
}
const CitiesContext = createContext()
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  )
  // const [cities, setCities] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [currentCity, setCurrentCity] = useState({})

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' })
      try {
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        dispatch({ type: 'cities/loaded', payload: data })
      } catch {
        dispatch({ type: 'rejected', payload: 'There is an Shit occure' })
      }
    }
    fetchCities()
  }, [])

  async function createCity(newCity) {
    dispatch({ type: 'loading' })
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      dispatch({ type: 'city/created', payload: data })
    } catch {
      dispatch({ type: 'rejected', payload: 'There is an Shit occure' })
    }
  }
  async function deleteCity(id) {
    dispatch({ type: 'loading' })
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      })
      dispatch({ type: 'cities/deleted', payload: id })
    } catch {
      dispatch({ type: 'rejected', payload: 'There is an Shit occure' })
    }
  }

  const getCity = useCallback(
    async function getCity(id) {
      if (parseInt(id) === currentCity.id) return
      dispatch({ type: 'loading' })
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`)
        const data = await res.json()
        dispatch({ type: 'city/loaded', payload: data })
      } catch {
        dispatch({ type: 'rejected', payload: 'There is an Shit occure' })
      }
    },
    [createCity.id],
  )
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined) {
    throw new Error('CitiesContext was used outside of CitiesProvider ')
  }
  return context
}
export { CitiesProvider, useCities }
