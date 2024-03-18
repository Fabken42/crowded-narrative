import express from 'express';
import { createStory, generateAccessKey, getStoriesList, getStory, createChapter, skipTurn, getChapter, getPublicStories, enterStoryPublic, enterStoryAccessKey } from '../controllers/Story.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/generate-access-key', verifyToken, generateAccessKey);
router.get('/get-stories-list', verifyToken, getStoriesList);
router.get('/get-public-stories', verifyToken, getPublicStories);
router.get('/:storyId', getStory);
router.get('/:storyId/:chapterNumber', getChapter);

router.post('/create', verifyToken, createStory);
router.post('/:storyId/create-chapter', verifyToken, createChapter);
router.post('/:storyId/skip-turn', verifyToken, skipTurn);

router.put('/enter-access-key', verifyToken, enterStoryAccessKey);
router.put('/:storyId/enter-public', verifyToken, enterStoryPublic);

export default router;