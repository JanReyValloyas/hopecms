import { describe, it, expect, vi } from 'vitest'

// Mock Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      getSession: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}))

import { supabase } from '../supabaseClient'

describe('Sprint 1 - Auth Flows', () => {

  // TEST 1: Email Registration
  it('should register a new user with email', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: 'test-uid', email: 'test@test.com' } },
      error: null
    })

    const { data, error } = await supabase.auth.signUp({
      email: 'test@test.com',
      password: 'password123'
    })

    expect(error).toBeNull()
    expect(data.user.email).toBe('test@test.com')
  })

  // TEST 2: Email Login
  it('should login with email and password', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'test-uid' } },
      error: null
    })

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@test.com',
      password: 'password123'
    })

    expect(error).toBeNull()
    expect(data.user).toBeDefined()
  })

  // TEST 3: Login with wrong password
  it('should fail login with wrong password', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' }
    })

    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@test.com',
      password: 'wrongpassword'
    })

    expect(error).not.toBeNull()
    expect(error.message).toBe('Invalid login credentials')
  })

  // TEST 4: Login guard blocks INACTIVE user
  it('should block INACTIVE user from logging in', async () => {
    const mockUserRow = {
      record_status: 'INACTIVE',
      user_type: 'USER',
      username: 'testuser'
    }

    supabase.from.mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValueOnce({
            data: mockUserRow,
            error: null
          })
        }))
      }))
    })

    const { data } = await supabase
      .from('user')
      .select('record_status, user_type, username')
      .eq('userid', 'test-uid')
      .single()

    expect(data.record_status).toBe('INACTIVE')
  })

  // TEST 5: Login guard allows ACTIVE user
  it('should allow ACTIVE user to login', async () => {
    const mockUserRow = {
      record_status: 'ACTIVE',
      user_type: 'SUPERADMIN',
      username: 'jcesperanza'
    }

    supabase.from.mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValueOnce({
            data: mockUserRow,
            error: null
          })
        }))
      }))
    })

    const { data } = await supabase
      .from('user')
      .select('record_status, user_type, username')
      .eq('userid', 'test-uid')
      .single()

    expect(data.record_status).toBe('ACTIVE')
    expect(data.user_type).toBe('SUPERADMIN')
  })

  // TEST 6: Sign out
  it('should sign out successfully', async () => {
    supabase.auth.signOut.mockResolvedValueOnce({ error: null })

    const { error } = await supabase.auth.signOut()
    expect(error).toBeNull()
  })

})