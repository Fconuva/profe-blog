const { getDatabase } = require('./firebase-config');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        const lastUpdate = event.queryStringParameters?.lastUpdate;

        if (!username) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Username is required' })
            };
        }

        const db = getDatabase();
        
        // Buscar usuario
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        if (!userSnapshot.exists()) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    hasUpdates: false,
                    message: 'User not found'
                })
            };
        }

        const userData = userSnapshot.val();
        const userId = Object.keys(userData)[0];

        // Obtener cursos del usuario
        const coursesRef = db.ref('courses');
        const coursesSnapshot = await coursesRef.orderByChild('userId').equalTo(userId).once('value');
        
        if (!coursesSnapshot.exists()) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    hasUpdates: false,
                    courses: []
                })
            };
        }

        // Si hay lastUpdate, verificar si hay cambios
        let hasUpdates = false;
        if (lastUpdate) {
            coursesSnapshot.forEach((childSnapshot) => {
                const course = childSnapshot.val();
                if (course.updatedAt && new Date(course.updatedAt) > new Date(lastUpdate)) {
                    hasUpdates = true;
                }
            });
        } else {
            hasUpdates = true; // Sin lastUpdate, consideramos que hay actualizaciones
        }

        const courses = [];
        coursesSnapshot.forEach((childSnapshot) => {
            const course = childSnapshot.val();
            courses.push({
                id: course.id || childSnapshot.key,
                courseName: course.courseName,
                updatedAt: course.updatedAt
            });
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                hasUpdates: hasUpdates,
                courses: courses,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Error in check-updates-Francisco:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to check updates',
                details: error.message
            })
        };
    }
};
