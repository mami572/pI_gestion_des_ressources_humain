const mysql = require('mysql2/promise');

async function testConnection() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'Grh_db'
    };

    console.log('Tentative de connexion à la base de données avec :', {
        host: config.host,
        user: config.user,
        database: config.database
    });

    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connexion réussie !');

        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('✅ Test de requête réussi (1+1 = ' + rows[0].result + ')');

        await connection.end();
    } catch (error) {//:    
        console.error('❌ Échec de la connexion :', error.message);
        console.log('\nConseils :');
        console.log('1. Vérifiez que MySQL est lancé.');//:1
        console.log('2. Vérifiez que la base de données "' + config.database + '" existe.');     //:2
        console.log('3. Vérifiez vos identifiants dans le fichier .env');    //:3
    }
}

testConnection();
