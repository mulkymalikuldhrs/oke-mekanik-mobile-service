import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email } = await request.json()
    if (email === 'test@example.com') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        token: 'fake-token',
      })
    } else {
      return new HttpResponse(null, { status: 401 })
    }
  }),
  http.post('/api/register', () => {
    return HttpResponse.json({
        user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
        },
        token: 'fake-token',
    })
  }),
]
