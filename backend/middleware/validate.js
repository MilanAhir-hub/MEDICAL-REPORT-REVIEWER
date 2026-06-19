import { ZodError } from 'zod';

/**
 * Middleware factory that validates req.body against a Zod schema.
 * Returns 422 Unprocessable Entity with field-level errors on failure.
 *
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const issues = error.errors || error.issues || [];
            const fieldErrors = issues.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            }));

            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: fieldErrors,
            });
        }
        next(error);
    }
};
