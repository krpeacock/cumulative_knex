
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (t)=> {
    t.increments();
    t.text('email');
    t.text('linkedin_id');
    t.text('alias');
    t.text('photo');
    t.text('password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
