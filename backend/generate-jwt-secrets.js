import crypto from 'crypto';

console.log('🔐 Génération de clés JWT sécurisées...\n');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

console.log('Copiez ces valeurs dans votre fichier backend/.env :\n');
console.log('JWT_SECRET=' + jwtSecret);
console.log('JWT_REFRESH_SECRET=' + jwtRefreshSecret);
console.log('\n✅ Clés générées avec succès !');
