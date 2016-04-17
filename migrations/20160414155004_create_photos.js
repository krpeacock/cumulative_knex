
exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', t=> {
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade');
    t.increments();
    t.string('ref');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
