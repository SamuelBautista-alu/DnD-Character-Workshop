export const responses = {
  success: (data, message = "Success") => ({
    status: "success",
    message,
    data,
  }),

  error: (message = "Error", status = 500) => ({
    status: "error",
    message,
    code: status,
  }),

  paginated: (data, total, page, limit) => ({
    status: "success",
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }),
};

export default responses;
