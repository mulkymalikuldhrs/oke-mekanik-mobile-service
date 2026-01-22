import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock data for the customer dashboard
  http.get('/api/customer/dashboard', () => {
    return HttpResponse.json({
      name: 'John Doe',
      email: 'john.doe@example.com',
      bookings: [
        { id: 1, mechanic: 'Jane Smith', service: 'Oil Change', date: '2024-08-15', status: 'Completed' },
        { id: 2, mechanic: 'Peter Jones', service: 'Tire Rotation', date: '2024-09-01', status: 'Scheduled' },
      ],
    })
  }),

  // Mock data for the mechanic dashboard
  http.get('/api/mechanic/dashboard', () => {
    return HttpResponse.json({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      jobs: [
        { id: 1, customer: 'John Doe', service: 'Oil Change', date: '2024-08-15', status: 'Completed' },
        { id: 2, customer: 'Alice Williams', service: 'Brake Inspection', date: '2024-08-20', status: 'In Progress' },
      ],
    })
  }),

  // Mock for booking a new service
  http.post('/api/bookings', () => {
    return HttpResponse.json({ success: true, message: 'Booking successful!' })
  }),

  // Mock for tracking a service
  http.get('/api/tracking/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      id,
      status: 'In Progress',
      estimatedCompletion: '2024-08-20T17:00:00Z',
    })
  }),

  // Mock for chat messages
  http.get('/api/chat/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      messages: [
        { id: 1, sender: 'customer', text: 'Hi, how is my car doing?' },
        { id: 2, sender: 'mechanic', text: 'We are currently working on it. It should be ready soon.' },
      ],
    })
  }),

  // Mock for sending a chat message
  http.post('/api/chat/:id', () => {
    return HttpResponse.json({ success: true, message: 'Message sent!' })
  }),

  // Mock for payment processing
  http.post('/api/payment', () => {
    return HttpResponse.json({ success: true, message: 'Payment successful!' })
  }),
]
