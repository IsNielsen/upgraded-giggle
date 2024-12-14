import { Outlet, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as cookie from 'cookie';

function ShoppingList() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const { events, user, recipes } = useOutletContext();
    const [shoppingList, setShoppingList] = useState(null);

     // Fetch shopping list data
     const fetchShoppingList = async () => {
        const res = await fetch('/shopping_list/', {
            credentials: 'same-origin',
        });
        const body = await res.json();
        setShoppingList(body.shopping_list);
    };

    // Call fetchShoppingList after the component mounts
    useEffect(() => {
        fetchShoppingList();
    }, []); 

    // connect to the backend to add items to the shopping list
    const addToShoppingList = async (item) => {
        const csrftoken = cookie.parse(document.cookie).csrftoken;
        const res = await fetch('/add_to_shopping_list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                item: item,
            }),
            credentials: 'same-origin',
        });

        if (res.ok) {
            const updatedList = await res.json();
            setShoppingList(updatedList.shopping_list);
        } else {
            console.error('Failed to add item');
        }
    };

    // update the backend and the frontend when adding an item
    function addItem(e){
        e.preventDefault();
        setItems(shoppingList.items);

        if (itemName) {
            setItems([...items, itemName]);  // add it to the list
            addToShoppingList(itemName);  // back end
            setItemName('');  // make the input field blank again
          }
    }

    function removeItem(index){
        // Back end needs fixing
        setItems(items.filter((_, i) => i !== index));
    }

    // Needs to grab ingredients from the meals of the next 7 calendar days
    function pullFromMealPlan(){

        // Get today's date (currentDate), only with year, month, and day
        const currentDate = new Date();

        for(var event in events){
            // Convert event.date to a Date object so we can compare them
            const eventDate = new Date(event.date);

            // for meals in the future, add their ingredients to the shopping list
            if(eventDate < currentDate){
                const recipeId = event.recipe.id;
                const recipe = recipes.find(recipe => recipe.id === parseInt(recipeId));

                for(var ingredient in recipe.ingredients){
                    addToShoppingList(ingredient[0]);  // just the ingredient name
                }
            }
        }
    }

    return (
        <main className='new-recipe-form' style={{width: "300px"}}> 
            <h2>Shopping List</h2>
            <div>
                <button type='button' onClick={pullFromMealPlan} style={{marginBottom: "10px"}}>Add Ingredients from Upcoming Meal Plan</button>
                <input
                    type='text'
                    placeholder='Item to Purchase'
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                />
                <button type='button' onClick={addItem}>Add Item</button>
            </div>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                    {item}
                    <button type='button' onClick={() => removeItem(index)}>x</button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default ShoppingList;