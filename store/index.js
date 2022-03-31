const getRateArray = (val) => {
  const rating = []
  for (let i = 1; i <= 5; i++) {
    if (val - i >= 0) {
      rating.push(true)
    } else {
      rating.push(false)
    }
  }

  return rating
}

const restaurantTemplate = {
  typeOfService: {
    name: 'Type of Service',
    key: 'service',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, illo! Sed vitae labore',
    fields: [
      {
        name: 'Fast Food',
      },
      {
        name: 'A la Carte',
      },
      {
        name: "Table D'Hote",
      },
    ],
  },
  typeOfFood: {
    name: 'Type of Food',
    key: 'cuisine',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, illo! Sed vitae labore',
    fields: [
      {
        name: 'Asian',
      },
      {
        name: 'Caribbean',
      },
      {
        name: 'Oriental',
      },
      {
        name: 'Italian',
      },
      {
        name: 'American',
      },
      {
        name: 'Traditional',
      },
    ],
  },
  typeOfOccassion: {
    name: 'Type of Occasion',
    key: 'occasion',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, illo! Sed vitae labore',
    fields: [
      {
        name: 'Family Meal',
      },
      {
        name: 'Romantic Dinner',
      },
      {
        name: 'Kids Meal',
      },
      {
        name: 'Business Lunches',
      },
      {
        name: 'View',
      },
    ],
  },
  diningOptions: {
    name: 'Dining Options',
    key: 'meals',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, illo! Sed vitae labore',
    fields: [
      {
        name: 'Breakfast',
      },
      {
        name: 'Lunch',
      },
      {
        name: 'Dinner',
      },
      {
        name: 'Supper',
      },
      {
        name: 'Takeout',
      },
    ],
  },
}

export const state = () => {
  return {
    user: {
      loggedIn: false,
    },
    restaurants: [],
    restaurantTemplate,
    searching: false,
  }
}

export const mutations = {
  setSearch(state, status) {
    state.searching = status
  },

  setUser(state, user) {
    if (user._id) {
      state.user = user
    } else {
      state.user = {
        loggedIn: false,
      }
    }
  },

  clearUser(state) {
    state.user = {
      loggedIn: false,
    }
  },

  setRestaurants(state, { data }) {
    state.restaurants = data
  },

  deleteRestaurant(state, { id }) {
    const index = state.restaurants.findIndex((res) => {
      return res._id === id
    })

    if (index < 0) return

    state.restaurants.splice(index, 1)
  },
}

export const actions = {
  getRestaurants({ commit, dispatch }, { query = '' }) {
    return this.$axios({
      method: 'GET',
      url: 'api/restaurant' + query,
    })
      .then(({ data }) => {
        let refined = []
        if (data.length) {
          console.log(data)
          refined = data.map((res) => {
            return {
              ...res,
              original: {
                ...res,
                originalCost: res.cost,
                minCost: res.cost.min,
                maxCost: res.cost.max,
              },
              options: [
                {
                  name: 'Type of Service',
                  key: 'service',
                  value: res.service,
                },
                {
                  name: 'Type of Food',
                  key: 'cuisine',
                  value: res.cuisine,
                },
                {
                  name: 'Type of Occasion',
                  key: 'occasion',
                  value: res.occasion,
                },
                {
                  name: 'Dining Options',
                  key: 'meals',
                  value: res.meals,
                },
              ],
              ratings: [
                {
                  name: 'Allergy Information',
                  rating: getRateArray(res.ratings.allergy),
                },
                {
                  name: 'Ambiance',
                  rating: getRateArray(res.ratings.ambiance),
                },
                {
                  name: 'Cleanliness',
                  rating: getRateArray(res.ratings.cleanliness),
                },
                {
                  name: 'Expense',
                  rating: getRateArray(res.ratings.expense),
                },
                {
                  name: 'Food',
                  rating: getRateArray(res.ratings.food),
                },
                {
                  name: 'Overall Delivery',
                  rating: getRateArray(res.ratings.overall),
                },
                {
                  name: 'Service Delivery',
                  rating: getRateArray(res.ratings.service),
                },
                {
                  name: 'Speed of Service',
                  rating: getRateArray(res.ratings.speed),
                },
                {
                  name: 'Value for Money',
                  rating: getRateArray(res.ratings.value),
                },
              ],
            }
          })
        }

        commit('setRestaurants', { data: refined })
        return refined
      })
      .catch((err) => {
        console.log(err)
        return Promise.reject(new Error(err))
      })
      .finally(() => {})
  },

  deleteRestaurant({ commit, dispatch }, { id }) {
    return this.$axios({
      method: 'DELETE',
      url: 'api/restaurant/' + id,
    })
      .then(({ data }) => {
        commit('deleteRestaurant', { id })
        return data
      })
      .catch((err) => {
        console.log(err)
        return Promise.reject(new Error(err))
      })
      .finally(() => {})
  },

  getRestaurant({ commit }, { id }) {
    return this.$axios({
      method: 'GET',
      url: 'api/restaurant/' + id,
    })
      .then(({ data }) => {
        data = JSON.parse(JSON.stringify(data))
        let refined = {}
        const cleanedReviews = []

        if (data.reviews.length) {
          data.reviews.forEach((review) => {
            const cleaned = {
              ...review,
              original: {
                ...review,
              },
              options: [
                {
                  name: 'Type of Service',
                  key: 'service',
                  value: review.service,
                },
                {
                  name: 'Type of Food',
                  key: 'cuisine',
                  value: review.cuisine,
                },
                {
                  name: 'Type of Occasion',
                  key: 'occasion',
                  value: review.occasion,
                },
                {
                  name: 'Dining Options',
                  key: 'meals',
                  value: review.meals,
                },
              ],
              ratings: [
                {
                  name: 'Allergy Information',
                  rating: getRateArray(review.allergyRating),
                },
                {
                  name: 'Ambiance',
                  rating: getRateArray(review.ambianceRating),
                },
                {
                  name: 'Cleanliness',
                  rating: getRateArray(review.cleanlinessRating),
                },
                {
                  name: 'Expense',
                  rating: getRateArray(review.expenseRating),
                },
                {
                  name: 'Food',
                  rating: getRateArray(review.foodRating),
                },
                {
                  name: 'Overall Delivery',
                  rating: getRateArray(review.overallRating),
                },
                {
                  name: 'Service Delivery',
                  rating: getRateArray(review.serviceRating),
                },
                {
                  name: 'Speed of Service',
                  rating: getRateArray(review.speedRating),
                },
                {
                  name: 'Value for Money',
                  rating: getRateArray(review.valueRating),
                },
              ],
            }
            cleanedReviews.push(cleaned)
          })
        }

        data.reviews = cleanedReviews.reverse()

        if (data._id) {
          refined = {
            ...data,
            original: {
              ...data,
              originalCost: data.cost,
              minCost: data.cost.min,
              maxCost: data.cost.max,
            },
            options: [
              {
                name: 'Type of Service',
                key: 'service',
                value: data.service,
              },
              {
                name: 'Type of Food',
                key: 'cuisine',
                value: data.cuisine,
              },
              {
                name: 'Type of Occasion',
                key: 'occasion',
                value: data.occasion,
              },
              {
                name: 'Dining Options',
                key: 'meals',
                value: data.meals,
              },
            ],
            ratings: [
              {
                name: 'Allergy Information',
                rating: getRateArray(data.ratings.allergy),
              },
              {
                name: 'Ambiance',
                rating: getRateArray(data.ratings.ambiance),
              },
              {
                name: 'Cleanliness',
                rating: getRateArray(data.ratings.cleanliness),
              },
              {
                name: 'Expense',
                rating: getRateArray(data.ratings.expense),
              },
              {
                name: 'Food',
                rating: getRateArray(data.ratings.food),
              },
              {
                name: 'Overall Delivery',
                rating: getRateArray(data.ratings.overall),
              },
              {
                name: 'Service Delivery',
                rating: getRateArray(data.ratings.service),
              },
              {
                name: 'Speed of Service',
                rating: getRateArray(data.ratings.speed),
              },
              {
                name: 'Value for Money',
                rating: getRateArray(data.ratings.value),
              },
            ],
          }
        }
        return refined
      })
      .catch((err) => {
        console.log(err)
        return Promise.reject(new Error(err))
      })
      .finally(() => {})
  },
}
