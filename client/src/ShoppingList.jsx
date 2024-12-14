import { Outlet, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import './App.css';

function ShoppingList() {
    const [items, setItems] = useState([]);
    // const [itemInput, setItemInput] = useState('');
    const [itemName, setItemName] = useState('');
    // const { events, user, shoppingList } = useOutletContext();
    const { events, user } = useOutletContext();

    const [shoppingList, setShoppingList] = useState(null);

     // Fetch shopping list data
     const fetchShoppingList = async () => {
        const res = await fetch('/shopping_list/', {
            credentials: 'same-origin',  // Include cookies for authentication
        });

        const body = await res.json();

        if (body.shopping_list) {
            setShoppingList(body.shopping_list);  // Set the shopping list object to state
        } else {
            console.error('No shopping list found');
        }
    };

    // Call fetchShoppingList only once when the component mounts
    useEffect(() => {
        fetchShoppingList();
    }, []); 

    function addItem(e){
        e.preventDefault();
        if (itemName) {
            setItems([...items, itemName]);  // add it to the list
            setItemName('');  // make the input field blank again
          }
    }

    function removeItem(index){
        console.log(shoppingList.items);
        setItems(shoppingList.items.filter((_, i) => i !== index));
    }

    // TODO
    // grab ingredients from the meals of the next 7 calendar days
    function pullFromMealPlan(){
        console.log(shoppingList); //print .type?? NOT WORKING
        // console.log(shoppingList.user);
        // console.log(shoppingList.items);
        console.log(user);
        console.log(events);
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