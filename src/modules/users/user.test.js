const supertest = require('supertest')
const app = require('@/app')

async function testUsers() {
  console.log('Testing Users endpoint...')

  try {
    const response = await supertest(app).get('/api/users')
    console.log('Status:', response.status)
    console.log('Response:', response.body)

    if (response.status === 200) {
      console.log('Test passed: Users endpoint returns 200')
    } else {
      console.log('Test failed: Expected 200, got', response.status)
    }
  } catch (error) {
    console.error('Test error:', error.message)
  }
}

testUsers()

