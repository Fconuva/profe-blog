const { getDatabase } = require('./firebase-config');

exports.handler = async (event) => {
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

        const db = getDatabase();
        
        // Buscar o crear usuario
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        let userId;
        if (!userSnapshot.exists()) {
            const newUserRef = usersRef.push();
            await newUserRef.set({
                username: username,
                createdAt: new Date().toISOString()
            });
            userId = newUserRef.key;
            console.log(`✅ New user created: ${username} (${userId})`);
        } else {
            const userData = userSnapshot.val();
            userId = Object.keys(userData)[0];
        }

        // Guardar cada curso
        const coursesRef = db.ref('courses');
        const savedCourses = [];
        const timestamp = new Date().toISOString();

        for (const course of courses) {
            if (!course.id) {
                // Nuevo curso sin ID, generar uno
                const newCourseRef = coursesRef.push();
                const courseData = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    userId: userId,
                    courseName: course.courseName,
                    subject: course.subject || '',
                    period: course.period || new Date().getFullYear().toString(),
                    students: course.students || [],
                    tasks: course.tasks || [],
                    config: course.config || {
                        minGrade: 1.0,
                        maxGrade: 7.0,
                        passingGrade: 4.0,
                        passingPercentage: 60
                    },
                    createdAt: timestamp,
                    updatedAt: timestamp
                };
                await newCourseRef.set(courseData);
                savedCourses.push({ ...courseData, firebaseKey: newCourseRef.key });
                console.log(`✅ New course created: ${course.courseName}`);
            } else {
                // Curso existente, buscar y actualizar
                const existingSnapshot = await coursesRef.orderByChild('id').equalTo(course.id).once('value');
                
                if (existingSnapshot.exists()) {
                    // Actualizar curso existente
                    const courseKey = Object.keys(existingSnapshot.val())[0];
                    const courseData = {
                        id: course.id,
                        userId: userId,
                        courseName: course.courseName,
                        subject: course.subject || '',
                        period: course.period || new Date().getFullYear().toString(),
                        students: course.students || [],
                        tasks: course.tasks || [],
                        config: course.config || {
                            minGrade: 1.0,
                            maxGrade: 7.0,
                            passingGrade: 4.0,
                            passingPercentage: 60
                        },
                        createdAt: existingSnapshot.val()[courseKey].createdAt,
                        updatedAt: timestamp
                    };
                    await coursesRef.child(courseKey).set(courseData);
                    savedCourses.push({ ...courseData, firebaseKey: courseKey });
                    console.log(`✅ Course updated: ${course.courseName}`);
                } else {
                    // Curso con ID pero no existe, crear nuevo
                    const newCourseRef = coursesRef.push();
                    const courseData = {
                        id: course.id,
                        userId: userId,
                        courseName: course.courseName,
                        subject: course.subject || '',
                        period: course.period || new Date().getFullYear().toString(),
                        students: course.students || [],
                        tasks: course.tasks || [],
                        config: course.config || {
                            minGrade: 1.0,
                            maxGrade: 7.0,
                            passingGrade: 4.0,
                            passingPercentage: 60
                        },
                        createdAt: timestamp,
                        updatedAt: timestamp
                    };
                    await newCourseRef.set(courseData);
                    savedCourses.push({ ...courseData, firebaseKey: newCourseRef.key });
                    console.log(`✅ Course created with existing ID: ${course.courseName}`);
                }
            }
        }

        console.log(`✅ Saved ${savedCourses.length} courses for user ${username}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Courses saved successfully',
                savedCourses: savedCourses.length,
                courses: savedCourses
            })
        };

    } catch (error) {
        console.error('❌ Error in save-courses-Francisco:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to save courses',
                details: error.message
            })
        };
    }
};
