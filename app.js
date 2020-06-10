const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

const courses = [
    { "id": 1, "name": 'Course 1' },
    { "id": 2, "name": 'Course 2' },
    { "id": 3, "name": 'Course 3' }
]


// Import posts
const postRoute = require('./routes/posts');
// Middlewares
app.use('/api/users', postRoute);


// Routes
app.get('/', (req, res) =>{
    res.send('Hello there Welcome to the Home page');
});

app.get('/api/courses', (req, res) =>{
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The Course with the given ID was not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    // Look up course
    // If not existing, return 404 - Not found
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The Course wit the given ID was not found');

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    // Update course
    // Return updated course
    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The Course with the given ID was not found');

    // Delete
    const index =courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course)
});



function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}





// Listen to server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));