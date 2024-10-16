import jwt from 'jsonwebtoken';
import { MetadataToken } from '../types/token';
import { CustomHttpExceptionError } from '../common/customError';

export async function TokenJwtGenerator(metadata: MetadataToken, expiredIn: string, isRefresh: boolean): Promise<string> {
    // Choose the appropriate secret key based on the token type (refresh or access)
    const secretKey = isRefresh ? process.env.JWT_REFRESH_SECRET_KEY : process.env.JWT_ACCESS_SECRET_KEY;

    if (!secretKey) {
        throw new Error('Secret key not found');
    }

    try {
        // Generate JWT token
        const token = jwt.sign(
            {
                id: metadata.id,
                name: metadata.name,
                email: metadata.email
            },
            secretKey,
            {
                issuer: 'marifsulaksono',
                algorithm: 'HS256',
                expiresIn: expiredIn,
            }
        );

        return token;
    } catch (error) {
        throw new Error(`Token generation failed: ${error.message}`);
    }
}

export async function TokenJwtVerification(token: string, isRefresh: boolean): Promise<MetadataToken> {
    const secretKey = isRefresh ? process.env.JWT_REFRESH_SECRET_KEY : process.env.JWT_ACCESS_SECRET_KEY;
    if (!secretKey) {
        throw new Error('Secret key not found');
    }

    try {
        const decodedToken = jwt.verify(token, secretKey, {
            issuer: 'marifsulaksono',
            algorithms: ['HS256'],
        });

        const metadata: MetadataToken = {
            id: decodedToken['id'],
            name: decodedToken['name'],
            email: decodedToken['email'],
        };

        return metadata;
    } catch (err) {
        throw new CustomHttpExceptionError('Terjadi kesalahan ketika memverifikasi token', 401, err);
    }
}
