import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { registerSchema } from '@/libs/z'
import z from 'zod'

export const formRules = reactive<FormRules>({
  name: [
    {
      validator: (_, value, callback) => {
        try {
          registerSchema.shape.name.parse(value)
          callback()
        } catch (err) {
          if (err instanceof z.ZodError) {
            callback(err.issues[0].message)
          } else {
            callback('Invalid name')
          }
        }
      },
      trigger: 'blur',
    },
  ],
  email: [
    {
      validator: (_, value, callback) => {
        try {
          registerSchema.shape.email.parse(value)
          callback()
        } catch (err) {
          if (err instanceof z.ZodError) {
            callback(err.issues[0].message)
          } else {
            callback('Invalid email')
          }
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_, value, callback) => {
        try {
          registerSchema.shape.password.parse(value)
          callback()
        } catch (err) {
          if (err instanceof z.ZodError) {
            callback(err.issues[0].message)
          } else {
            callback('Invalid password')
          }
        }
      },
      trigger: 'blur',
    },
  ],
  phone: [
    {
      validator: (_, value, callback) => {
        if (!value) {
          callback()
          return
        }
        try {
          registerSchema.shape.phone.parse(value)
          callback()
        } catch (err) {
          if (err instanceof z.ZodError) {
            callback(err.issues[0].message)
          } else {
            callback('Invalid phone number')
          }
        }
      },
      trigger: 'blur',
    },
  ],
  address: [
    {
      validator: (_, value, callback) => {
        if (!value) {
          callback()
          return
        }
        try {
          registerSchema.shape.address.parse(value)
          callback()
        } catch (err) {
          if (err instanceof z.ZodError) {
            callback(err.issues[0].message)
          } else {
            callback('Invalid address')
          }
        }
      },
      trigger: 'blur',
    },
  ],
})
