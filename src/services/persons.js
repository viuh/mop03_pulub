import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const deletex = (id) => {
    console.log("DelService",id)
    return axios.delete(`${baseUrl}/${id}`)

}

const get = (id) => {
  console.log('GetServ',id)
  return axios.get(`${baseUrl}/${id}`)
}


export default { getAll, create, update,deletex }