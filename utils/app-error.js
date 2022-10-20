class AppError extends Error {
  constructor(errorData) {
    super(errorData.message);
    this.statusCode = errorData.status;
  }
}

/* Errors glossary */
const appErrors = {
  badRequest: {
    status: 400,
    message: 'Некорректные данные',
  },
  notAuthorized: {
    status: 401,
    message: 'Вы не авторизованы',
  },
  forbidden: {
    status: 403,
    message: 'Нет разрешения',
  },
  notFound: {
    status: 404,
    message: 'Не найдено',
  },
  conflict: {
    status: 409,
    message: 'Этот адрес почты уже используется',
  },
  serverError: {
    status: 500,
    message: 'Ошибка на сервере',
  },
};

module.exports = { AppError, appErrors };
