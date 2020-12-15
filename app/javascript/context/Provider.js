import React, { createContext, useReducer } from 'react'

import { createActions } from 'context/leaseUpActionCreators'
import Reducer, { getEmptyApplication, getEmptyListing } from 'context/Reducer'

const initialState = {
  breadcrumbData: {
    listing: getEmptyListing(),
    application: getEmptyApplication()
  }
}

export const AppContext = createContext()

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  const actions = createActions(dispatch)
  return <AppContext.Provider value={[state, actions]}>{children}</AppContext.Provider>
}

export default Provider
