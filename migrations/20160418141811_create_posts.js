
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', (t)=> {
    t.increments();
    t.text('data');
    t.integer('user_id').unsigned().index().references('id').inTable('users').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
