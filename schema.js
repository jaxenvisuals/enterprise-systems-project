// Note the object structures of the different datasets
export const incomingFlights = {
  Aircraft: String, // This should be used as the unique key for this schema
  Departure: String,
  Arrival: String,
  Terminal: String,
}

export const airlines = {
  '2 Letter Code': String, // This should be used as the unique key for this schema
  'Company Name': String,
  Country: String,
}

export const threats = {
  'Threat ID': String, // This should be used as the unique key for this schema
  'Passport Number': String,
  'Threat Level': Number,
  'Terrorism (50%)': Number,
  'Smuggling (20%)': Number,
  'Narcotics (15%)': Number,
  'Illegal Immigration (15%)': Number,
}

export const airports = {
  'IATA Code': String, // This should be used as the unique key for this schema
  'ISO Alpha 3 Code': String,
  'Long Name': String,
  'Long Location': String,
}

export const aircrafts = {
  'Aircraft Number': String, // This should be used as the unique key for this schema
  'Passenger Capacity': Number,
  'Crew Capacity': Number,
}

export const passengers = {
  'Passport Number': String, // This should be used as the unique key of this schema
  'Flight Number': String,
  'Threat Level': Number,
  Forename: String,
  'Family Name': String,
  Gender: String,
  DOB: String,
  Nationality: String,
  Revenue: Number,
  'Seat Number': String,
}
