const { getDatabase } = require('./firebase-config');

exports.handler = async (event) => {
    const startTime = Date.now();
    console.log('⏱️ save-courses-Francisco started');
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        const { courses, username } = body;

        if (!courses || !Array.isArray(courses)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Courses array is required' })
            };
        }

        if (!username) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Username is required' })
            };
        }

        console.log(`📥 Saving ${courses.length} course(s) for ${username}`);
        const db = getDatabase();
        
        // Buscar o crear usuario (OPTIMIZADO: una sola query)
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        let userId;
        if (!userSnapshot.exists()) {
            const newUserRef = usersRef.push();
            userId = newUserRef.key;
            await newUserRef.set({
                username: username,
                createdAt: Date.now()
            });
            console.log(`✨ Created user: ${userId}`);
        } else {
            userId = Object.keys(userSnapshot.val())[0];
            console.log(`✓ Found user: ${userId}`);
        }

        // Guardar cursos (BATCH)
        const coursesRef = db.ref('courses');
        const timestamp = Date.now();
        const savedCourses = [];

        // Usar Promise.all para guardar todos los cursos en paralelo
        await Promise.all(courses.map(async (course) => {
            const courseData = {
                id: course.id || timestamp + Math.floor(Math.random() * 1000),
                userId: userId,
                courseName: course.courseName,
                subject: course.subject || '',
                period: course.period || '2025',
                students: course.students || [],
                tasks: course.tasks || [],
                config: course.config || { minGrade: 1.0, maxGrade: 7.0, passingGrade: 4.0, passingPercentage: 60 },
                createdAt: timestamp,
                updatedAt: timestamp
            };

            if (course.id) {
                // Buscar si existe
                const existingSnapshot = await coursesRef.orderByChild('id').equalTo(course.id).once('value');
                if (existingSnapshot.exists()) {
                    // Actualizar
                    const courseKey = Object.keys(existingSnapshot.val())[0];
                    await coursesRef.child(courseKey).update(courseData);
                    savedCourses.push({ ...courseData, firebaseKey: courseKey });
                    console.log(`✓ Updated: ${course.courseName}`);
                    return;
                }
            }

            // Crear nuevo
            const newCourseRef = await coursesRef.push();
            await newCourseRef.set(courseData);
            savedCourses.push({ ...courseData, firebaseKey: newCourseRef.key });
            console.log(`✨ Created: ${course.courseName}`);
        }));

        const elapsed = Date.now() - startTime;
        console.log(`✅ Saved ${savedCourses.length} courses in ${elapsed}ms`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Saved ${savedCourses.length} courses`,
                elapsed: elapsed,
                courses: savedCourses
            })
        };

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`❌ Error after ${elapsed}ms:`, error.message);
        console.error('Stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to save courses',
                details: error.message,
                elapsed: elapsed
            })
        };
    }
};
