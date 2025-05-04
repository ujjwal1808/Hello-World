import express from 'express';
const router = express.Router();
import * as communityController from '../controllers/communityController.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.js';

console.log(communityController);  // Optional for debugging

// Community core features
router.post('/', protectRoute, communityController.createCommunity);
router.get("/", protectRoute, communityController.getUserCommunities);
router.get("/my-communities", protectRoute, communityController.getUserCommunities);
router.get("/:communityId", protectRoute, communityController.getSingleCommunity);

// Member actions
router.post("/:communityId/accept", protectRoute, communityController.acceptCommunityInvite);
router.get("/:communityId/members", protectRoute, communityController.getCommunityMembers);
router.post('/:communityId/add-members', protectRoute, communityController.addMembersToCommunity);

// Remove member from community
router.delete('/:communityId/remove-member/:memberId', protectRoute, communityController.removeMemberFromCommunity);

// Media
router.post("/:communityId/media", protectRoute, upload.single('media'), communityController.uploadMedia);
router.get("/:communityId/media", protectRoute, communityController.getCommunityMedia);

// Messaging
router.get("/:communityId/messages", protectRoute, communityController.getCommunityMessages);
router.post("/:communityId/messages", protectRoute, communityController.sendMessage);
router.delete('/:communityId/messages', protectRoute, communityController.deleteAllMessages);
router.post('/:communityId/messages/delete-selected', protectRoute, communityController.deleteSelectedMessages);

// Invites
router.post("/:communityId/invite", protectRoute, communityController.inviteToCommunity);
router.post("/:communityId/accept-invite", protectRoute, communityController.acceptCommunityInvite);

export default router;
