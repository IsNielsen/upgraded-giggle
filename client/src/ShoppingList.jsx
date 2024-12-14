import { Outlet, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import './App.css';
// import cookie from 'cookie';
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

    // Call fetchShoppingList only once when the component mounts
    useEffect(() => {
        fetchShoppingList();
    }, []); 


    const addToShoppingList = async (item) => {
        const csrftoken = cookie.parse(document.cookie).csrftoken; // Extract CSRF token from cookies
        
    
        const res = await fetch('/add_to_shopping_list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,  // Include the CSRF token
            },
            body: JSON.stringify({
                item: item,
            }),
            credentials: 'same-origin',  // Ensure the cookie is sent with the request
        });

        if (res.ok) {
            const updatedList = await res.json();
            setShoppingList(updatedList.shopping_list);  // Update the shopping list state
        } else {
            console.error('Failed to add item');
        }
    };

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
            // Convert event.date to a Date object
            const eventDate = new Date(event.date);

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
            <h3>Shopping List</h3>
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
                {/* {shoppingList && shoppingList.items && Array.isArray(shoppingList.items) && shoppingList.items.map((item, index) => ( */}
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