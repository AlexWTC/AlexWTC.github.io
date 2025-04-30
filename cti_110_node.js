// This section loads modules. It loads the Express server and stores
// it in "express", then creates an application, a router, and a path handler
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// This part sets up the database
const { Pool } = require('pg');
// Modify your database credentials if necessary
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
const pool = new Pool({ connectionString });

// This line says when it's looking for a file linked locally,
// check in sub-folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve the gradebook.html file
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'gradebook.html'));
});

app.use("/", router);

// API route to fetch student grades
router.get('/api/grades', function(req, res) {
    pool.query(
        `SELECT students.student_id, first_name, last_name, AVG(assignments.grade) AS total_grade
         FROM students
         LEFT JOIN Assignments ON Assignments.student_id = students.student_id
         GROUP BY students.student_id
         ORDER BY total_grade DESC`,
        [],
        function(err, result) {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' }); // Return a server error if there's an issue
            }

            // Check if result and result.rows are valid before proceeding
            if (!result || !result.rows) {
                console.error('No data returned from the query');
                return res.status(404).json({ error: 'No data found' }); // Return an error if result is empty or invalid
            }

            // Log the results of each row
            result.rows.forEach(function(row) {
                console.log(`Student Name: ${row.first_name} ${row.last_name}`);
                console.log(`Grade: ${row.total_grade}`);
            });

            // Return the result rows as a JSON response
            res.status(200).json(result.rows);
        }
    );
});

// Start the server
let server = app.listen(3000, function() {
    console.log("App Server via Express is listening on port 3000");
    console.log("To quit, press CTRL + C");
});
