const { getDatabase } = require('./firebase-config');

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const username = event.queryStringParameters?.username;
        
        if (!username) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Username is required' })
            };
        }

        const db = getDatabase();
        
        // Buscar o crear usuario
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        let userId;
        if (!userSnapshot.exists()) {
            // Crear nuevo usuario
            const newUserRef = usersRef.push();
            await newUserRef.set({
                username: username,
                createdAt: new Date().toISOString()
            });
            userId = newUserRef.key;
            console.log(`✅ New user created: ${username} (${userId})`);
        } else {
            // Usuario existente
            const userData = userSnapshot.val();
            userId = Object.keys(userData)[0];
            console.log(`✅ Existing user found: ${username} (${userId})`);
        }

        // Obtener cursos del usuario
        const coursesRef = db.ref('courses');
        const coursesSnapshot = await coursesRef.orderByChild('userId').equalTo(userId).once('value');
        
        const courses = [];
        if (coursesSnapshot.exists()) {
            coursesSnapshot.forEach((childSnapshot) => {
                const course = childSnapshot.val();
                courses.push({
                    id: course.id || childSnapshot.key,
                    courseName: course.courseName,
                    subject: course.subject,
                    period: course.period,
                    students: course.students || [],
                    tasks: course.tasks || [],
                    config: course.config || {
                        minGrade: 1.0,
                        maxGrade: 7.0,
                        passingGrade: 4.0,
                        passingPercentage: 60
                    },
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt
                });
            });
        }

        console.log(`✅ Retrieved ${courses.length} courses for user ${username}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                courses: courses,
                userId: userId,
                username: username
            })
        };

    } catch (error) {
        console.error('❌ Error in get-courses-Francisco:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch courses',
                details: error.message
            })
        };
    }
};
