import {API_BASE} from "../../app/config"

export async function http(endpoint, { body, ...customConfig } = {}) {
    const headers = { 'Content-Type': 'application/json' }
  
    const config = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    }
  
    if (body) {
      config.body = JSON.stringify(body)
    }
  
    let data
    try {
      const response = await window.fetch(API_BASE + endpoint, config)
      data = ['DELETE' , 'PUT'].includes(config.method) ? await response.text() : await response.json();
      if (response.ok) {
        return {
          status: response.status,
          data,
          headers: response.headers,
          url: response.url,
        }
      }
      throw new Error(response.statusText)
    } catch (err) {
      return Promise.reject(err.message ? err.message : data)
    }
  }
  
  http.get = function (endpoint, customConfig = {}) {
    return http(endpoint, { ...customConfig, method: 'GET' })
  }
  
  http.post = function (endpoint, body, customConfig = {}) {
    return http(endpoint, { ...customConfig, body })
  }

  http.delete = function (endpoint, customConfig = {}) {
    return http(endpoint, { ...customConfig, method: 'DELETE' })
  }

  http.put = function (endpoint,body,  customConfig = {}) {
    body.id = body._id;
    delete body._id;
    return http(endpoint, { ...customConfig,body, method: 'PUT' })
  }