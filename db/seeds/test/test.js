
const itemData = [
  {name: 'Oxygen', packed: false},
  {name: 'Bandana', packed: true},
  {name: 'Photos', packed: true}
]

const createItem = (knex, item) => {
  const { name, packed } = item;

  return knex('items').insert({
    name,
    packed
  }, 'id')
}

exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(() => {
      let itemPromises = [];

      itemData.forEach(item => {
        itemPromises.push(createItem(knex, item))
      })

      return Promise.all(itemPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
