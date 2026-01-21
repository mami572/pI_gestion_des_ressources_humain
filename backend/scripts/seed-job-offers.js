const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function seedJobOffers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Sample job offers
        const jobOffers = [
            {
                title: 'Développeur Full Stack Senior',
                department: 'Informatique',
                location: 'Nouakchott',
                type: 'CDI',
                description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe. Vous serez responsable du développement et de la maintenance de nos applications web.',
                status: 'open'
            },
            {
                title: 'Responsable Ressources Humaines',
                department: 'RH',
                location: 'Nouakchott',
                type: 'CDI',
                description: 'Gérer le recrutement, la formation et le développement des employés. Participer à la définition de la stratégie RH de l\'entreprise.',
                status: 'open'
            },
            {
                title: 'Spécialiste Marketing Digital',
                department: 'Marketing',
                location: 'Nouakchott',
                type: 'CDD',
                description: 'Développer et mettre en œuvre des stratégies de marketing digital pour accroître notre présence en ligne et générer des leads.',
                status: 'open'
            },
            {
                title: 'Analyste Financier',
                department: 'Finance',
                location: 'Nouakchott',
                type: 'CDI',
                description: 'Analyser les données financières, préparer des rapports et fournir des recommandations pour optimiser la performance financière.',
                status: 'closed'
            },
            {
                title: 'Stagiaire DevOps',
                department: 'Informatique',
                location: 'Nouakchott',
                type: 'Stage',
                description: 'Assister l\'équipe DevOps dans l\'automatisation des déploiements et la gestion de l\'infrastructure cloud.',
                status: 'open'
            }
        ];

        console.log('🔄 Creating job offers...');

        for (const offer of jobOffers) {
            const [result] = await connection.execute(
                `INSERT INTO JobOffer (title, department, location, type, description, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [offer.title, offer.department, offer.location, offer.type, offer.description, offer.status]
            );

            console.log(`✅ Created: ${offer.title} (ID: ${result.insertId})`);

            // Add candidates for some offers
            if (result.insertId <= 3) {
                const candidatesCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < candidatesCount; i++) {
                    await connection.execute(
                        `INSERT INTO Candidate (first_name, last_name, email, phone, status, job_offer_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                        [
                            `Candidat${i + 1}`,
                            `Test${result.insertId}`,
                            `candidat${i + 1}@example.com`,
                            `+222 22 34 56 ${70 + i}${result.insertId}`,
                            ['new', 'inReview', 'shortlisted'][Math.floor(Math.random() * 3)],
                            result.insertId
                        ]
                    );
                }
                console.log(`   👥 Added ${candidatesCount} candidates`);
            }
        }

        console.log('\n✅ All job offers created successfully!');
        console.log('📊 Summary:');
        console.log(`   - ${jobOffers.length} job offers`);
        console.log(`   - Multiple candidates added`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

seedJobOffers();
