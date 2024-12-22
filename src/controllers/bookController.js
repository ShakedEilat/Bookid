const Book = require('../models/bookModel');
const { ERROR_MESSAGES, RESPONSE_MESSAGES, STATUS_CODES, PROMPTS, API_KEYS } = require('../../utils/consts');
const { generateBook, generateIllustration } = require('../services/openaiService');
const ChildProfile = require('../models/childProfileModel');
const axios = require('axios');

// Create a new book based on a child's profile
/**
 * @api {post} /books Create a new book
 * @apiName CreateBook
 * @apiGroup Books
 *
 * @apiParam {String} childProfileId The ID of the child profile associated with the book
 * @apiParam {String} pages The amount of pages in the book
 *
 * @apiSuccess {Object} book The created book document
 * @apiSuccess {String} book.title The title of the book
 * @apiSuccess {Object[]} book.bookData The book's data, split into parts (e.g. paragraphs) with accompanying illustrations
 * @apiSuccess {Number} book.bookData.part_id The part ID of the book (1-indexed)
 * @apiSuccess {String} book.bookData.text The text of the part
 * @apiSuccess {String} book.bookData.image_url The URL of the illustration for the part
 *
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.createBook = async (req, res) => {
    const uploadImageToPermanentStorage = async (imageUrl) => {
        try {
            // Using a free image hosting service like ImgBB
            const apiKey = API_KEYS.IMAGEBB;
            const response = await axios.post(`https://api.imgbb.com/1/upload`, null, {
                params: {
                    key: apiKey,
                    image: imageUrl,
                },
            });
            return response.data.data.url; // Return the uploaded image URL
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Image upload failed');
        }
    };

    try {
        const { childProfileId, pages } = req.body;

        // Fetch the child's profile
        const child = await ChildProfile.findById(childProfileId);
        if (!child) {
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: ERROR_MESSAGES.CHILD_PROFILE_NOT_FOUND });
        }

        const childData = {
            name: child.name,
            age: child.age,
            gender: child.gender,
            appearance: child.appearance,
            hobbies: child.hobbies,
            location: child.location,
            outfit: child.outfit,
            favoriteFood: child.favoriteFood,
            favoriteColor: child.favoriteColor,
            favoriteThingToDo: child.favoriteThingToDo,
            mostLovedCharacter: child.mostLovedCharacter,
            additionalInfo: child.additionalInfo,
        }

        // Generate book using OpenAI API
        let bookText = await generateBook(childData, pages);

        // Step 2: Split the story into parts (example: by paragraphs)
        const bookPages = bookText.split('\n\n').filter(para => para.trim() !== '');

        const title = bookPages[0].trim()

        // Utility function to introduce a delay
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Step 3: Generate illustrations for each part
        let bookData = [];
        for (let index = 0; index < bookPages.length; index++) {
            const text = bookPages[index];
            if (index === bookPages.length - 1) {
                bookData.push({
                    part_id: index + 1,
                    text: text.trim(),
                    image_url: '',
                });
                continue;
            }
            function sanitizeInput(input) {
                return input
                    .replace(/[^a-zA-Z0-9 .,?!'"]/g, '') // Remove special characters
                    .trim(); // Trim extra spaces
            }
            
            const sceneDescription = sanitizeInput(`This page describes: "${text.trim()}"`);

            try {
                let image_url = await generateIllustration(childData, sceneDescription);
                image_url = await uploadImageToPermanentStorage(image_url); // Upload to permanent storage

                bookData.push({
                    part_id: index + 1,
                    text: text.trim(),
                    image_url,
                });
            } catch (error) {
                let image_url = bookData[0]? bookData[0].image_url : '';
                if (error.message.includes('safety system')) {
                    console.warn('Safety system rejected the input. Retrying with a generic prompt...');
                    const fallbackDescription = PROMPTS.GENERATE_ILLUSTRATION_FALLBACK(childData);
                    image_url = await generateIllustration(childData, sceneDescription, fallbackDescription);
                    image_url = await uploadImageToPermanentStorage(image_url); // Upload fallback image to permanent storage
                    bookData.push({
                        part_id: index + 1,
                        text: text.trim(),
                        image_url,
                    });
                }
                throw error; // Re-throw other errors
            }


            if ((index + 1) % 5 === 0) { // After every 5 requests, wait 1 minute
                await delay(60000); // 60,000 ms = 1 minute
            } else {
                await delay(2000); // Spread out requests, ~2 seconds between each
            }
        }


        // Step 4: Create a new book document
        const newBook = new Book({
            childProfileId,
            title,
            bookData,
        });



        await newBook.save();
        res.status(STATUS_CODES.CREATED).send({ message: RESPONSE_MESSAGES.SUCCESS, book: newBook });
    } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.BOOK_GENERATION_FAILED });
    }
};


/**
 * @api {get} /books/:bookId Fetch an existing book by ID
 * @apiName GetBook
 * @apiGroup Books
 *
 * @apiParam {String} bookId The ID of the book to retrieve
 *
 * @apiSuccess {Object} book The retrieved book document
 * @apiSuccess {String} book.title The title of the book
 * @apiSuccess {Object[]} book.bookData The book's data, split into parts with accompanying illustrations
 * @apiSuccess {Number} book.bookData.part_id The part ID of the book (1-indexed)
 * @apiSuccess {String} book.bookData.text The text of the part
 * @apiSuccess {String} book.bookData.image_url The URL of the illustration for the part
 *
 * @apiError {Object} 404 Book not found
 * @apiError {String} 404.error The error message
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.getBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        // Retrieve book by ID and populate child profile details
        // const book = await Book.findById(bookId).populate('childProfileId');
        const book = await Book.findById(bookId)

        // If the book is not found, send a 404 response
        if (!book) {
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: ERROR_MESSAGES.BOOK_GENERATION_FAILED });
        }

        // Send the retrieved book with a 200 status code
        res.status(STATUS_CODES.SUCCESS).send({ book });
    } catch (error) {
        // Log the error and send a 500 response if an exception occurs
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};

/**
 * @api {get} /books Fetch all books associated with the user's children
 * @apiName GetBooks
 * @apiGroup Books
 *
 * @apiSuccess {Object[]} books Array of book documents
 * @apiSuccess {String} books._id The ID of the book
 * @apiSuccess {String} books.title The title of the book
 * @apiSuccess {String} books.childProfileId The ID of the associated child profile
 * @apiSuccess {Object[]} books.bookData The book's data, split into parts with accompanying illustrations
 * @apiSuccess {Number} books.bookData.part_id The part ID of the book (1-indexed)
 * @apiSuccess {String} books.bookData.text The text of the part
 * @apiSuccess {String} books.bookData.image_url The URL of the illustration for the part
 *
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.getBooks = async (req, res) => {
    try {
        const userId = req.userId; // Assumes authentication middleware provides req.user

        // Fetch all child profiles associated with the user
        const childProfiles = await ChildProfile.find({ userId });

        // Extract child profile IDs
        const childProfileIds = childProfiles.map(child => child._id);

        // Fetch all books associated with these child profiles
        const books = await Book.find({ childProfileId: { $in: childProfileIds } });

        res.status(STATUS_CODES.SUCCESS).send({ books });
    } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};


/**
 * @api {put} /books/:bookId Edit book content
 * @apiName EditBook
 * @apiGroup Books
 *
 * @apiParam {String} bookId The ID of the book to edit
 * @apiParam {Object[]} bookData The updated book data
 * @apiParam {Number} bookData.part_id The part ID of the book to update (1-indexed)
 * @apiParam {String} [bookData.text] The updated text for the part
 * @apiParam {String} [bookData.image_url] The updated URL of the illustration for the part
 *
 * @apiSuccess {Object} book The updated book document
 * @apiSuccess {String} book.title The title of the book
 * @apiSuccess {Object[]} book.bookData The book's updated data, split into parts with accompanying illustrations
 * @apiSuccess {Number} book.bookData.part_id The part ID of the book (1-indexed)
 * @apiSuccess {String} book.bookData.text The text of the part
 * @apiSuccess {String} book.bookData.image_url The URL of the illustration for the part
 *
 * @apiError {Object} 404 Book not found
 * @apiError {String} 404.error The error message
 * @apiError {Object} 400 Invalid input
 * @apiError {String} 400.error The error message
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.editBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { bookData } = req.body;

        console.log('Editing book:', bookId);
        console.log('Request body:', req.body);

        // Validate input
        if (!Array.isArray(bookData) || bookData.length === 0) {
            console.error('Invalid input:', bookData);
            return res.status(STATUS_CODES.BAD_REQUEST).send({ error: ERROR_MESSAGES.INVALID_INPUT });
        }

        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            console.error('Book not found:', bookId);
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: ERROR_MESSAGES.BOOK_NOT_FOUND });
        }

        console.log('Found book:', book);

        // Update the book data
        bookData.forEach(update => {
            const part = book.bookData.find(part => part.part_id === update.part_id);
            if (part) {
                if (update.text) part.text = update.text;
                if (update.image_url) part.image_url = update.image_url;
            }
        });

        console.log('Updated book data:', book.bookData);

        // Save the updated book
        await book.save();

        console.log('Book updated:', book);

        res.status(STATUS_CODES.SUCCESS).send({ book });
    } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};

