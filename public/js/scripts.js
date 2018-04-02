$(window).on('load', () => handlePageLoad())
$('#form__button-submit').on('click', (e) => handleSubmit(e));
$('.list__section').on('click', '.list__card .list__card-heading-cont .list__card-delete', handleDelete);
// event listener for delete button// event listener for packed checkbox

// Event Handlers
const handlePageLoad = () => {
  loadAllItems();
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const item = $('#form__input-item').val();
  const postedItem = await postItem(item);

  appendItem(postedItem);
  $('#form__input-item').val('');
}

function handleDelete() {
  const itemId = this.closest('.list__card').id;

  this.closest('.list__card').remove();
  deleteItem(itemId);
}

const handleCheck() {

}

// DOM 
const appendItem = item => {
  const { id, name, packed } = item;
  const isChecked = packed ? 'checked' : '';

  $('.list__section').append(`
    <article id=${id} class="list__card">
      <div class="list__card-heading-cont">
        <h3 class="List__card-h3">${name}</h3>
        <button class="list__card-delete">Delete</button>
      </div>
      <input id='packed-${id}' type="checkbox" value="Packed" ${isChecked}>
      <label for='packed-${id}'>Packed</label>
    </article>
  `)
}

const loadAllItems = async () => {
  const items = await getItems();

  items.forEach( item => {
    appendItem(item);
  })
}

// Fetch calls

const getItems = async () => {
  const response = await fetch('/api/v1/items');
  return await response.json();
}

const postItem = async (item) => {
  const name = item;
  const postItem = JSON.stringify({ 
    item: {
     name,
     packed: 'false'
    }
  })
  const fetchBody = {
    method: 'POST',
    body: postItem,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const response = await fetch('/api/v1/items', fetchBody);
  return await response.json();
}

const deleteItem = async (itemId) => {
  const fetchBody = {
    method: 'DELETE',
    header: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await fetch(`/api/v1/items/${itemId}`, fetchBody);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
