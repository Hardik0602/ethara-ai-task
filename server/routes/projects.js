const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const User = require('../models/User')
const auth = require('../middleware/auth')
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body
    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id]
    })
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }]
    }).populate('admin', 'name email').populate('members', 'name email')
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email')
    if (!project) return res.status(404).json({ message: 'Project not found' })
    const isMember = project.members.some(m => m._id.toString() === req.user.id)
    if (!isMember) return res.status(403).json({ message: 'Access denied' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.post('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (project.admin.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only admin can perform this action' })
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (project.members.includes(user._id)) return res.status(400).json({ message: 'User already a member' })
    project.members.push(user._id)
    await project.save()
    res.json({ message: 'Member added', project })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (project.admin.toString() !== req.user.id) return res.status(403).json({ message: 'Only admin can perform this action' })
    if (project.admin.toString() === req.params.userId) return res.status(400).json({ message: 'Cannot remove admin from project' })
    project.members = project.members.filter(m => m.toString() !== req.params.userId)
    await project.save()
    res.json({ message: 'Member removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})
module.exports = router