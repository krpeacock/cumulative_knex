
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t=> {
    t.increments();
    t.text('username').unique();
    t.text('password');
    t.text('alias')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
