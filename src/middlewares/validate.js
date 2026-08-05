export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    // Replace req parameters with validated/coerced data from Zod
    req.body = parsed.body ?? req.body;
    req.query = parsed.query ?? req.query;
    req.params = parsed.params ?? req.params;

    return next();
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation Error',
        errors: error.errors.map((e) => ({
          field: e.path.join('.').replace(/^(body|query|params)\./, ''),
          message: e.message
        }))
      });
    }

    // Forward non-validation errors to the Express global error handler
    return next(error);
  }
};