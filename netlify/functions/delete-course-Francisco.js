const { getDatabase } = require('./firebase-config');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { courseId, username } = body;

        if (!courseId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Course ID is required' })
            };
        }

        const db = getDatabase();
        const coursesRef = db.ref('courses');
        
        // Buscar el curso por ID
        const courseSnapshot = await coursesRef.orderByChild('id').equalTo(courseId).once('value');
        
        if (!courseSnapshot.exists()) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Course not found' })
            };
        }

        // Eliminar el curso
        const courseKey = Object.keys(courseSnapshot.val())[0];
        await coursesRef.child(courseKey).remove();

        console.log(`✅ Course deleted: ${courseId}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Course deleted successfully',
                courseId: courseId
            })
        };

    } catch (error) {
        console.error('❌ Error in delete-course-Francisco:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to delete course',
                details: error.message
            })
        };
    }
};
