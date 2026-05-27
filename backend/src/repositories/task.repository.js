import { Task } from '../models/Task.js'

export const createTask = (data) => Task.create(data)

export const findTasks = (filters, { skip, limit, sort }) =>
  Task.find(filters).sort(sort).skip(skip).limit(limit)

export const findTaskById = (id) => Task.findById(id)

export const updateTask = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true })

export const deleteTask = (id) => Task.findByIdAndDelete(id)

export const addComment = (id, comment) =>
  Task.findByIdAndUpdate(
    id,
    { $push: { comments: comment } },
    { new: true },
  )
