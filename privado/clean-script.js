// Script para limpiar base de datos automáticamente
const usernames = ['fconuva', 'francisco_fconuva', 'profesor2_profesor2'];

async function cleanAll() {
    console.log('🧹 Iniciando limpieza completa de base de datos...');
    
    for (const username of usernames) {
        try {
            console.log(`Limpiando: ${username}`);
            
            const response = await fetch('https://profefranciscopancho-blog.onrender.com/api/courses/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courses: [],
                    username: username
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ ${username}: Limpiado`);
            } else {
                console.log(`⚠️ ${username}: ${data.error}`);
            }
            
        } catch (error) {
            console.log(`❌ ${username}: ${error.message}`);
        }
    }
    
    console.log('✅ Limpieza de BD completada');
}

cleanAll();
