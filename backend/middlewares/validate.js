export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map(err => ({
          field: err.context.key,
          message: err.message
        }));

        return res.status(400).json({
          status: 'error',
          errors
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Validation failed due to internal error'
      });
    }
  };
};
