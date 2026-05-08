const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const Project = require('../models/Project')
const auth = require('../middleware/auth')
const isMember = (project, userId) => project.members.some(m => m.toString() === userId)
const isAdmin = (project, userId) => project.admin.toString() === userId
router.post('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (!isAdmin(project, req.user.id)) return res.status(403).json({ message: 'Only admin can perform this action' })
    const { title, description, dueDate, priority, assignedTo } = req.body
    if (assignedTo && !isMember(project, assignedTo)) return res.status(400).json({ message: 'User is not a project member' })
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      project: project._id,
      createdBy: req.user.id
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (!isMember(project, req.user.id)) return res.status(403).json({ message: 'Access denied' })
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.patch('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    const project = await Project.findById(task.project)
    if (!isMember(project, req.user.id)) return res.status(403).json({ message: 'Access denied' })
    if (isAdmin(project, req.user.id)) {
      const { title, description, dueDate, priority, status, assignedTo } = req.body
      if (title) task.title = title
      if (description) task.description = description
      if (dueDate) task.dueDate = dueDate
      if (priority) task.priority = priority
      if (status) task.status = status
      if (assignedTo) task.assignedTo = assignedTo
    } else {
      if (req.body.status) {
        task.status = req.body.status
      } else {
        return res.status(403).json({ message: 'Members can only update task status' })
      }
    }
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    const project = await Project.findById(task.project)
    if (!isAdmin(project, req.user.id)) return res.status(403).json({ message: 'Only admin can perform this action' })
    await task.deleteOne()
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.get('/dashboard/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (!isMember(project, req.user.id)) return res.status(403).json({ message: 'Access denied' })
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
    const total = tasks.length
    const byStatus = {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length,
    }
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length
    const perUser = {}
    tasks.forEach(task => {
      if (task.assignedTo) {
        const name = task.assignedTo.name
        perUser[name] = (perUser[name] || 0) + 1
      }
    })
    res.json({ total, byStatus, overdue, perUser })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
module.exports = router