import { v4 as uuidv4 } from 'uuid'
// import { customAlphabet } from 'nanoid'

// const nanoid = customAlphabet('1234567890abcdef', 10)

export default ({ app }, inject) => {
  inject('uuid', () => uuidv4())
  // inject('nanoid', () => nanoid())
}
