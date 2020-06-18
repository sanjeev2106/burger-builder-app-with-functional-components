import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) =>{

    const transformedIngredient = Object.keys(props.ingredients)
    .map(igkey => {
        return [...Array(props.ingredients[igkey])].map((_, i) => {
            return <BurgerIngredient key={igkey + 1} type={igkey} />;
        });
    });

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredient}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    )
}

export default burger;