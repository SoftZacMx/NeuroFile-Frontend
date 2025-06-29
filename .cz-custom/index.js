'use strict';

module.exports = {
  prompter(cz, commit) {
    cz.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Selecciona el tipo de cambio:',
        choices: ['feat', 'fix', 'refactor', 'chore', 'docs', 'style', 'test'],
      },
      {
        type: 'input',
        name: 'module',
        message: '¿En qué módulo trabajaste? (ej: auth, paciente, core)',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Descripción breve del cambio:',
        validate(input) {
          return input.length >= 10
            ? true
            : 'La descripción debe tener al menos 10 caracteres.';
        }
      }
    ]).then(answers => {
      const message = `${answers.type} - ${answers.module} - ${answers.description}`;
      commit(message);
    });
  }
};
