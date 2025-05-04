import Community from '../models/community.models.js';
import User from '../models/user.model.js';

// Create a new community
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    const community = await Community.create({
      name,
      description,
      createdBy: userId,
      members: [userId],
      messages: [],
      media: [],
    });

    res.status(201).json({ success: true, community });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating community', error: err.message });
  }
};

// Accept community invite (NOOP for this version)
export const acceptCommunityInvite = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// Invite to community (NOOP for this version)
export const inviteToCommunity = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// Get all members
export const getCommunityMembers = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId).populate('members', 'name email profilePicture');
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    res.status(200).json({ success: true, members: community.members });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching members', error: err.message });
  }
};

// Upload media (fix: return uploaded url)
export const uploadMedia = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user._id;
    // Accept both form-data and JSON
    let url, type;
    if (req.file) {
      // If using multer or similar for file uploads
      url = `/uploads/${req.file.filename}`;
      type = req.file.mimetype.startsWith('image') ? 'image' : req.file.mimetype.startsWith('video') ? 'video' : 'file';
    } else {
      url = req.body.url;
      type = req.body.type;
    }
    if (!url || !type) return res.status(400).json({ success: false, message: 'Missing media url or type' });
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    if (!community.members.includes(userId)) {
      return res.status(403).json({ success: false, message: 'You are not a member of this community' });
    }
    community.media.push({ url, type, uploadedBy: userId });
    await community.save();
    res.status(200).json({ success: true, message: 'Media uploaded', url });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error uploading media', error: err.message });
  }
};

// Get community media
export const getCommunityMedia = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId).populate('media.uploadedBy', 'name');
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    res.status(200).json({ success: true, media: community.media });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching media', error: err.message });
  }
};

// Get user communities
export const getUserCommunities = async (req, res) => {
  try {
    const userId = req.user._id;

    const communities = await Community.find({ members: userId }).select("_id name");
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user communities" });
  }
};

// Controller for retrieving messages with pagination and sorting
export const getCommunityMessages = async (req, res) => {
  const { communityId } = req.params;
  const { page = 1, limit = 20 } = req.query; // Default to page 1, limit to 20 messages

  try {
    // Fetch the community and populate sender details
    const community = await Community.findById(communityId)
      .populate('messages.sender', 'name profilePic')
      .populate('members', 'name username profilePicture'); // Ensure members are populated

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Sort messages by createdAt (most recent first)
    let messages = [...community.messages].sort((a, b) => b.createdAt - a.createdAt);

    // Paginate
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginatedMessages = messages.slice(start, end);

    // Format messages to include sender's name and message content
    const formattedMessages = paginatedMessages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      mediaUrl: msg.mediaUrl,
      mediaType: msg.mediaType,
      createdAt: msg.createdAt,
      sender: msg.sender && typeof msg.sender === 'object' ? {
        _id: msg.sender._id,
        name: msg.sender.name,
        profilePic: msg.sender.profilePic
      } : { name: 'Unknown', _id: null, profilePic: null }
    }));

    return res.status(200).json({ messages: formattedMessages }); // Always return as { messages: [...] }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for sending a message to a community
export const sendMessage = async (req, res) => {
  const { communityId } = req.params;
  const { content, mediaUrl, mediaType } = req.body;
  const userId = req.user._id;

  try {
    const message = {
      content,
      mediaUrl,
      mediaType,
      sender: userId,
      createdAt: new Date(),
    };

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    community.messages.push(message);
    await community.save();

    // Populate sender details for the last message
    const populatedCommunity = await Community.findById(communityId).populate('messages.sender', 'name profilePic');
    const populatedMessage = populatedCommunity.messages[populatedCommunity.messages.length - 1];

    return res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single community
export const getSingleCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId).populate("members", "name username profilePicture");

    if (!community) return res.status(404).json({ message: "Community not found" });

    res.status(200).json({ community });
  } catch (err) {
    console.error("Error fetching community:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user details" });
  }
};

// Add member(s) to community
export const addMembersToCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { memberIds } = req.body; // Array of user IDs to add
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No member IDs provided' });
    }
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    // Only add users not already in members
    const toAdd = memberIds.filter(id => !community.members.includes(id));
    community.members.push(...toAdd);
    await community.save();
    // Populate members for response
    await community.populate('members', 'name username profilePicture');
    res.status(200).json({ success: true, members: community.members });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding members', error: err.message });
  }
};

// Remove member from community
export const removeMemberFromCommunity = async (req, res) => {
  try {
    const { communityId, memberId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    // Prevent removing the creator
    if (community.createdBy.toString() === memberId) {
      return res.status(403).json({ success: false, message: 'Cannot remove the community creator' });
    }
    community.members = community.members.filter(id => id.toString() !== memberId);
    await community.save();
    await community.populate('members', 'name username profilePicture');
    res.status(200).json({ success: true, members: community.members });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error removing member', error: err.message });
  }
};

// Delete all messages in a community
export const deleteAllMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    community.messages = [];
    await community.save();
    res.status(200).json({ success: true, message: 'All messages deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting messages', error: err.message });
  }
};

// Delete selected messages in a community
export const deleteSelectedMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { messageIds } = req.body;
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No message IDs provided' });
    }
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    community.messages = community.messages.filter(msg => !messageIds.includes(msg._id.toString()));
    await community.save();
    res.status(200).json({ success: true, message: 'Selected messages deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting selected messages', error: err.message });
  }
};