import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'
import { requireRoles } from '../middlewares/requireRoles.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { ROLES } from '../utils/constants.js'
import {
  createWorkspace,
  listWorkspaces,
  inviteMember,
  acceptInvite,
} from '../validations/workspace.validation.js'
import {
  createWorkspace as createWorkspaceHandler,
  listUserWorkspaces,
  inviteMember as inviteMemberHandler,
  acceptInvite as acceptInviteHandler,
} from '../controllers/workspace.controller.js'

const router = Router()

router.get('/', authenticate, validateRequest(listWorkspaces), listUserWorkspaces)
router.post('/', authenticate, validateRequest(createWorkspace), createWorkspaceHandler)
router.post(
  '/:workspaceId/invites',
  authenticate,
  requireRoles(ROLES.OWNER, ROLES.ADMIN),
  validateRequest(inviteMember),
  inviteMemberHandler,
)
router.post(
  '/:workspaceId/invites/accept',
  authenticate,
  validateRequest(acceptInvite),
  acceptInviteHandler,
)

export default router
