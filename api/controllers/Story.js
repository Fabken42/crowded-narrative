import { errorHandler } from "../utils/error.js";
import Story from "../models/Story.js";

export const createStory = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { title, ...otherFields } = req.body;

        await Story.create({
            title: title.charAt(0).toUpperCase() + title.slice(1),
            authorsIDs: [user_id],
            currentAuthorID: user_id,
            ...otherFields
        });

        res.status(200).json({ message: 'Sucesso ao criar história!' });
    } catch (error) {
        next(error);
    }
};

export const getStory = async (req, res, next) => {
    try {
        const story = await Story.findOne({ _id: req.params.storyId })
            .populate({
                path: 'authorsIDs',
                select: 'username avatar'
            });
        res.json({ story });
    } catch (error) {
        next(error);
    }
}

export const enterStoryPublic = async (req, res, next) => {
    try {
        const { storyId } = req.params;
        const { userId } = req.body;
        if (!storyId || !userId) {
            return next(errorHandler(400, 'Parâmetros inválidos.'));
        }

        const story = await Story.findOne({ _id: storyId });

        if (!story) return next(errorHandler(404, 'História não encontrada!'));
        if (story.maxAuthors === story.authorsIDs.length) return next(errorHandler(401, 'Grupo cheio!'));

        await Story.findOneAndUpdate(
            { _id: storyId },
            { $addToSet: { authorsIDs: userId } }
        );

        res.status(200).json({ message: 'Usuário adicionado à história com sucesso!' });
    } catch (error) {
        next(error);
    }
};

export const enterStoryAccessKey = async (req, res, next) => {
    try {
        const { accessKey, userId } = req.body;
        if (!userId || !accessKey) {
            return next(errorHandler(400, 'Parâmetros inválidos.'));
        }

        const story = await Story.findOne({ accessKey });

        if (!story) return next(errorHandler(404, 'História não encontrada!'));
        if (story.maxAuthors === story.authorsIDs.length) return next(errorHandler(401, 'Grupo cheio!'));

        await Story.findOneAndUpdate(
            { accessKey },
            { $addToSet: { authorsIDs: userId } }
        );

        res.status(200).json({ message: 'Usuário adicionado à história com sucesso!' });
    } catch (error) {
        next(error);
    }
};

export const getChapter = async (req, res, next) => {
    try {
        const pos = req.params.chapterNumber - 1;
        const story = await Story.findOne({ _id: req.params.storyId });

        if (!story) return next(errorHandler(404, 'História não encontrada!'));
        if (!story.chapters[pos]) return next(errorHandler('Capítulo não encontrado!', 404));

        await story.populate({
            path: 'chapters.author',
            select: 'username avatar'
        })

        const chapter = story.chapters[pos];
        res.json({ chapter, chapterCounter: story.chapterCounter });
    } catch (error) {
        next(error);
    }
}

export const getStoriesList = async (req, res, next) => {
    try {
        const stories = await Story.find({ authorsIDs: { $in: [req.user.id] } })
            .populate({
                path: 'authorsIDs',
                select: 'username avatar'
            });
        res.json({ stories });
    } catch (error) {
        next(error);
    }
}

export const getPublicStories = async (req, res, next) => {
    try {
        const stories = await Story.find({
            entranceType: 'public',
            completed: false,
            $expr: { $lt: [{ $size: "$authorsIDs" }, "$maxAuthors"] }
        }).populate({
            path: 'authorsIDs',
            select: 'username avatar timeRemainingToWriteChapter'
        });
        res.json({ stories });
    } catch (error) {
        next(error);
    }
}

export const generateAccessKey = (req, res, next) => {
    try {
        const accessKey = Math.random().toString(36).slice(-8);
        res.json({ accessKey });
    } catch (error) {
        next(error);
    }
}

export const createChapter = async (req, res, next) => {
    try {
        const { finishNarrative, chapterTitle, chapterContent, userId, storyCounter, storyId } = req.body;

        if (!storyId) return next(errorHandler(400, 'ID da história não fornecido'));

        const existingStory = await Story.findById(storyId);
        if (!existingStory) return next(errorHandler(404, 'Narrativa não encontrada!'));

        if (!(existingStory.chapterCounter == storyCounter)) return next(errorHandler(400, 'Este capítulo já foi escrito!'));

        // if (userId !== existingStory.currentAuthorID) { 
        //     return res.status(403).json({ message: 'Usuário não autorizado.' });
        // }

        const newChapter = {
            title: chapterTitle.charAt(0).toUpperCase() + chapterTitle.slice(1),
            content: chapterContent,
            author: userId,
            chapterNumber: existingStory.chapterCounter + 1
        };

        existingStory.chapters.push(newChapter);
        existingStory.chapterCounter++;
        if (finishNarrative) existingStory.completed = true;
        await existingStory.save();

        return res.status(201).json({ message: 'Capítulo criado com sucesso!', chapter: newChapter });
    } catch (error) {
        next(error);
    }
};
/* const MAX_CHAPTERS = 30 obs: se story tiver mais que 30 capitulos, não será possivel criar mais. Informar o usuário que numero máximo de capitulos é de 30 logo na criação narrativa (início) */

export const skipTurn = async (req, res, next) => { 
    try {
        const { storyId, userId } = req.body;

        if (!storyId || !userId) return next(errorHandler(400, 'Parâmetros inválidos.'));

        const story = await Story.findOne({ _id: storyId });
        if (!story) return next(errorHandler(404, 'Narrativa não encontrada!'));
        
        if (story.currentAuthorID.toString() !== userId) return next(errorHandler(403, 'Usuário não autorizado.'));

        let nextAuthorIndex = story.authorsIDs.indexOf(userId) + 1;
        if (nextAuthorIndex >= story.authorsIDs.length) {
            nextAuthorIndex = 0; 
        }
        const nextAuthor = story.authorsIDs[nextAuthorIndex];
        
        story.currentAuthorID = nextAuthor;
        await story.save();
        
        res.status(200).json({ message: 'Pulou o turno com sucesso!' });
    }
    catch (error) {
        next(error);
    }
}
