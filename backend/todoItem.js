const Sequelize = require('sequelize')
const sequelize = new Sequelize("postgres://test_user:c4pPdkgrndsI9MpdgGtaSjGbJGJFryeT@oregon-postgres.render.com/test_db_47yf")

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

//  const TodoItem = sequelize.define('todos', {
//    title: {
//        type: Sequelize.STRING,
//        allowNull: false
//    },
//});

const TodoItem = sequelize.define('todos', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // --- ADD THIS BLOCK ---
    priority: {
        type: Sequelize.INTEGER,
        // Optional but recommended: set a default (e.g., 3 for lowest priority)
        defaultValue: 3, 
        // Optional but recommended: add validation
        validate: {
            isIn: [[1, 2, 3]] // Only allows 1, 2, or 3
        }
    }
    // --- END OF ADDED BLOCK ---
});
TodoItem.sync()
