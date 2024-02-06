import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PopupWindow from 'components/components/PopupWindow/PopupWindow'

import './styles.scss'
import { setIntrelocutorCountriesAction } from 'redux/actions/userActions'
import { userInterlocutorCountriesSelector } from 'redux/selectors/userSelectors'

type CountriesSelectorProps = {
  close: () => void
}

type Countries = {
  [key: string]: boolean
  Belarus: boolean,
  Ukraine: boolean,
  Russia: boolean,
  Kazakhstan: boolean,
  Lithuania: boolean,
  Latvia: boolean,
  Estonia: boolean,
  Poland: boolean,
  Germany: boolean,
}



const CountriesSelector = (props: CountriesSelectorProps) => {
  const dispatch = useDispatch()
  const interlocutorCountries = useSelector(userInterlocutorCountriesSelector)

  const getCountries = () => {
    const defaultCountries: Countries = {
      Belarus: false,
      Ukraine: false,
      Russia: false,
      Kazakhstan: false,
      Lithuania: false,
      Latvia: false,
      Estonia: false,
      Poland: false,
      Germany: false,
    }

    interlocutorCountries.forEach(countries => {
      defaultCountries[countries] = true
    })
    
    return defaultCountries
  }
  
  const [countries, setCountries] = useState<Countries>(getCountries())

  const countriesRef = useRef(countries)

  const changeActiveCountries = (country: string) => {
    const countriesList = { ...countries }
    countriesList[country] = !countriesList[country]
    setCountries(countriesList)
    countriesRef.current = countriesList
  }

  const selectAll = () => {
    const countriesList = { ...countries }
    Object.keys(countriesList).forEach(country => countriesList[country] = true)
    setCountries(countriesList)
    countriesRef.current = countriesList
  }

  useEffect(() => {

    return () => {
      const interlocutorCountries = Object.keys(countriesRef.current).filter(country => countriesRef.current[country] === true).map(country => country)
      localStorage.setItem('interlocutor_countries', JSON.stringify(interlocutorCountries))
      setIntrelocutorCountriesAction(dispatch, { interlocutorCountries: interlocutorCountries })
    }
  }, [])

  return (
    <PopupWindow close={props.close} alt='Countries'>
      <p className='countries-selector__title'>
        {'Preferred interlocutors'}
      </p>

      <div
        className='countries-selector__select-all'
        onClick={() => selectAll()}
      >
        Select all
      </div>
      
      <div className='countries-selector__flags'>
        {Object.keys(countries).map(country => (
          <img
            key={country}
            src={`/flags/${country}.webp`}
            alt={country}
            className={`countries-selector__flag ${countries[country] ? 'countries-selector__flag-active' : ''}`}
            onClick={() => changeActiveCountries(country)}
          />
        ))}
      </div>
    </PopupWindow>
  )
}

export default CountriesSelector